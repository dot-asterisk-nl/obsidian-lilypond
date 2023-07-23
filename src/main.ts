import { Plugin } from "obsidian";
import { SettingsTab } from "./settings";
import { render } from './lilypond';


interface LilypondPluginSettings {
	path: string;
}

const DEFAULT_LILY_PATH =  "/usr/local/bin/lilypond";

const DEFAULT_SETTINGS: Partial<LilypondPluginSettings> = {
	path: "",
};

export default class LilypondPlugin extends Plugin {
	settings: LilypondPluginSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new SettingsTab(this.app, this));

		this.registerMarkdownCodeBlockProcessor("lily", (source, el) => {
			render(source, this.settings.path || DEFAULT_LILY_PATH, el);
		})
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
