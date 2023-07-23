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
	exec(`${lilypondPath} -dbackend=svg -fsvg --silent --output=${lyFileDir} ${lyFile.path}`)
	.then(() => {
		const outputPath = lyFile.path.substring(0, lyFile.path.lastIndexOf(".ly")).concat(".svg");
		el.innerHTML = fs.readFileSync(outputPath, {encoding: "utf8", flag: "r"});
	})
	.catch((error) => {
		console.error(error);

		const paragraph = document.createElement("p");
		paragraph.classList.add("lily-error");
		paragraph.innerHTML = error;
		paragraph.style.whiteSpace = "pre-wrap";

		el.innerHTML = paragraph.innerHTML;
	});

};
