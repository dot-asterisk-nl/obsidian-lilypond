import * as path from "path";
import * as fs from "fs";
import * as temp from "temp";
import { promisify } from "util";
import { exec as execCallback } from "child_process";

const exec = promisify(execCallback);

// windows path: "C:\Program Files (x86)\LilyPond\usr\bin\lilypond-windows.exe"

export const render = async function (
	lilypondCode: string,
	lilypondPath: string,
	el: HTMLElement
) {

	// using temp files in the filesystem
	temp.track();
	const lyFile = temp.openSync({ suffix: ".ly" });
	fs.writeSync(lyFile.fd, lilypondCode);
	fs.closeSync(lyFile.fd);

	const lyFileDir = path.join(lyFile.path, "..");
	try {
		await exec(`${lilypondPath} -dbackend=svg -dpoint-and-click=false -fsvg --silent --output=${lyFileDir} ${lyFile.path}`)

		const outputPaths = collectFiles(lyFile.path)

		const htmls = await renderSvgs(outputPaths)

		el.innerHTML = htmls.join("<br/><br/>")
	} catch (error) {
		console.error(error);
		renderError(error, el)
	}
};

const renderSvgs = async (files: string[]): Promise<string[]> => {
	const htmls = await Promise.all(
		files.map(
			(path) => fs.promises.readFile(path, { encoding: "utf8", flag: "r" }),
		),
	)
	return htmls
}

const collectFiles = (lyFilePath: string): string[] => {
	const fileNameNoExt = path.join(path.dirname(lyFilePath), path.basename(lyFilePath, '.ly'))

	const dirName = lyFilePath.substring(0, lyFilePath.lastIndexOf("/"))

	const outputPaths = fs.readdirSync(dirName)
		.filter(f => path.basename(f).contains(path.basename(fileNameNoExt)) && f.endsWith('.svg'))
		.sort()
		.map((f) => path.join(dirName, f))

	if (!outputPaths.length) {
		throw `no output files found for ${lyFilePath}!`
	}

	return outputPaths
}

const renderError = (error: string, el: HTMLElement) => {
	const paragraph = document.createElement("p");
	paragraph.classList.add("lily-error");
	paragraph.innerHTML = error;
	paragraph.style.whiteSpace = "pre-wrap";

	el.innerHTML = paragraph.innerHTML;
}
