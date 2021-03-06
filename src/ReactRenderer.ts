import * as React from "react"
import * as unescape from "unescape"
import * as MarkdownItComponent from "markdown-it-component"
import Renderer from "./Renderer"
import AstRenderer, { AstRendererOptions } from "./AstRenderer"

export default class ReactRenderer extends Renderer<React.ReactNode> {
	constructor(
		options: AstRendererOptions<React.ReactNode> = {},
		plugins: Array<any> = []
	) {
		const merged = {
			root: children =>
				options.root
					? options.root(children)
					: React.createElement("main", {}, ...children),
			text: value =>
				options.text ? options.text(unescape(value)) : unescape(value),
			tag: (name, props, children) => {
				const actualProps = props["json-data"]
					? JSON.parse(unescape(props["json-data"]))
					: props
				if (options.tag) {
					const result = options.tag(name, actualProps, children)
					if (result !== undefined) {
						return result
					}
				}
				return React.createElement(name, actualProps, ...children)
			},
		}
		super(merged, [...plugins, MarkdownItComponent({ jsonData: true })])
	}
}
