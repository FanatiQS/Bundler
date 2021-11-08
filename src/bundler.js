import { HtmlParser } from "./htmlParser.js";

export function Bundler(resolver) {
	this.resolveDependency = resolver;
}

// Parses and bundles a files content
Bundler.prototype.parse = async function (src, file, fileType) {
	// Fetches the html files content
	const code = await this.resolveDependency(`${src}${file}`);

	// Creates output array for strings and promises
	const output = [];

	// Returns input if filetype can not be bundled further
	if (!this.parsers[fileType]) return code;

	// Loops through input looking for matches using parser
	let index = 0;
	const parser = new this.parsers[fileType](code);
	for (const { value, indexStart, indexEnd, type } of parser) {
		const content = await this.parse(src, value, type);
		output.push(
			code.slice(index, indexStart),
			parser[type](content)
		);
		index = indexEnd;
	}

	// Adds remaining data to output after last match
	output.push(code.slice(index));

	// Returns promise resolving when all files have been loaded
	return Promise.all(output).then((arr) => arr.join(''));
}

// A library of all filetypes that can be parsed
Bundler.prototype.parsers = {
	html: HtmlParser
};
