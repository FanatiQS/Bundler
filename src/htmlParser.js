// Parser for html files
export function HtmlParser(input) {
	this.input = input;
}

HtmlParser.prototype[Symbol.iterator] = function* () {
	const regex = /<(link|script)(.*href=\"| src=\")(.*)".*>/g;
	let match = null;
	while ((match = regex.exec(this.input)) !== null) {
		yield {
			value: match[3],
			type: match[1],
			indexStart: match.index,
			indexEnd: regex.lastIndex
		};
	}
};

HtmlParser.prototype.link = function (input) {
	return `<style>\n${input}\n</style>`;
};

HtmlParser.prototype.script = function (input) {
	return `<script>\n${input}\n</script>`;
};
