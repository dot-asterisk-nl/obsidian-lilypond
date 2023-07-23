import LilypondPlugin from "src/main";
import { App, PluginSettingTab, Setting } from "obsidian";

export class SettingsTab extends PluginSettingTab {
	plugin: LilypondPlugin;

	constructor(app: App, plugin: LilypondPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Lilypond Path")
			.setDesc("Path to lilypond binary")
			.addText((text) =>
				text
					.setPlaceholder("/usr/local/bin/lilypond")
					.setValue(this.plugin.settings.path)
					.onChange(async (value) => {
						this.plugin.settings.path = value.trim();
						await this.plugin.saveSettings();
					})
			);
	}
}
