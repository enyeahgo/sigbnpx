module.exports = {
	globDirectory: 'public/',
	globPatterns: [
		'**/*.{json,0,css,html,png,js,ts,md}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: 'public/service-worker.js'
};