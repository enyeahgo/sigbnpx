module.exports = {
	globDirectory: 'public/admin',
	globPatterns: [
		'**/*.{json,0,css,html,png,gif,jpg,js,ico,ts,md}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: 'public/admin/service-worker.js'
};