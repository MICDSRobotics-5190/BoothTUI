var config = require(__dirname + '/config.json')
const request = require('request')
const reqp = require('request-promise')

function formatURI(uri) {
	var eventname = uri.split('/')
	return 'https://api.ftcscores.com/api/events/' + eventname[eventname.length - 1]
}

/*reqp(formatURI(config.target))
.then((htmlString) => {
console.log(find5190Rank(JSON.parse(htmlString)).name)
})*/


reqp(formatURI(config.target))
.then((htmlString) => {
	
	var blessed = require('blessed');
	var ranks = JSON.parse(htmlString).rankings;
	var info = JSON.parse(htmlString)
	// Create a screen object.
	var screen = blessed.screen({
		smartCSR: true
	});
	
	screen.title = 'FTCScoresCurses';
	
	// Create a box perfectly centered horizontally and vertically.
	
	var top5 = "";
	
	for (var i = 0; i < config.show; i++) {
		top5 += `${i + 1}. ${ranks[i].number} - ${ranks[i].name}\n`
	}
	
	var bigTitle = blessed.text({
		top: '0',
		left: 'center',
		width: '100%',
		height: '20%',
		content: 'Technoramic 5190',
		align: 'center',
		valign: 'center',
		tags: true,
		style: {
			fg: 'white',
			bg: 'red'
		}
	});
	
	var box = blessed.box({
		top: 'center',
		left: 'center',
		width: '45%',
		height: '50%',
		content: `{bold}Top ${config.show} Teams{/bold}\n${top5}`,
		tags: true,
		style: {
			fg: 'white',
			bg: 'blue'
		}
	});
	
	var eventInfoPane = blessed.box({
		top: 'center',
		right: '0',
		width: '25%',
		height: '50%',
		content: '{bold}Event Info{/bold}\n' + `Name: ${info.shortName}\nType: ${info.type}\nLocation: ${info.location}\nDivision: ${info.subtitle}\nStart: ${Date(info.startDate)}\nEnd: ${Date(info.endDate)}`,
		tags: true,
		style: {
			fg: 'white',
			bg: 'green'
		}
	});
	
	var teamInfo = blessed.box({
		top: 'center',
		left: '0',
		width: '25%',
		height: '50%',
		content: '{bold}5190 Info{/bold}\nLocation: Saint Louis, MO\nSchool: MICDS',
		tags: true,
		style: {
			fg: 'white',
			bg: 'yellow'
		}
	});
	
	// Append our box to the screen.
	screen.append(box);
	screen.append(eventInfoPane);
	screen.append(teamInfo);
	screen.append(bigTitle);
	
	// Quit on Escape, q, or Control-C.
	screen.key(['escape', 'q', 'C-c'], function(ch, key) {
		return process.exit(0);
	});
	
	// Focus our element.
	box.focus();
	
	// Render the screen.
	screen.render();
})
.catch((error) => {
	console.log(error);
})