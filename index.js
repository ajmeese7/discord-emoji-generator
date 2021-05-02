// Waits until the document's elements are available
document.addEventListener("DOMContentLoaded", function(event) {
	let emojiText = document.getElementById("emojiText");
	let generateButton = document.getElementById("generateButton");
	if (!emojiText.value) generateButton.disabled = true;
	let downloadButton = document.getElementById("downloadButton");
	downloadButton.disabled = true;

	// Disables button if emojiText empty; otherwise enabled
	emojiText.oninput = () => generateButton.disabled = !emojiText.value;

	// Configures advanced settings dropdown
	let advanced = document.getElementById("advanced");
	let dropdown = document.getElementById("dropdown");
	dropdown.onclick = () => {
		// https://stackoverflow.com/a/21696585/6456163
		advanced.style.display = advanced.offsetParent ? "none" : "block";
		dropdown.innerText = advanced.offsetParent ? "▲" : "▼";
	}

	// Initialize color picker options
	$('#text-color').colorpicker({
		color: 'rgb(0, 0, 0)',
		format: 'rgba'
	});
	$('#background-color').colorpicker({
		color: 'rgba(255, 255, 255, 0)',
		format: 'rgba'
	});
});

// ---------------------------------------------------

async function generateEmoji() {
	const emojiText = document.getElementById("emojiText").value;
	const textColor = document.getElementById("txt-color").value;
	const backgroundColor = document.getElementById("bg-color").value;
	const emojiSize = parseInt(document.getElementById("emojiSize").value || 128); 
	const spaceBetweenLines = parseInt(document.getElementById("lineSpacing").value || 0);
	let fontface = document.getElementById("font").value || "monospace";

	// https://stackoverflow.com/a/36248266/6456163
	if (fontface.includes("http")) {
		const myFont = new FontFace('Custom Font', `url(${fontface})`);
		await myFont.load().then((font) => {
			document.fonts.add(font);
			console.log("Custom font loaded!");
			fontface = "Custom Font";
		});
	}

	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d");
	canvas.height = emojiSize;
	canvas.width = emojiSize;
	context.fillStyle = backgroundColor;
	context.fillRect(0, 0, canvas.width, canvas.height);

	// TODO: Option to customize font with dropdown/URLs here
	const words = emojiText.split(' ');
	const longestWord = [...words].sort((a, b) => a.length < b.length)[0];
	const lineSpacing = spaceBetweenLines * (words.length - 1);
	const fontSize = generateTextSize(1, emojiSize / words.length);
	const textHeight = fontSize * words.length;
	const firstLineOffset = (emojiSize - textHeight - lineSpacing) / 2;
	context.fillStyle = textColor;
	context.textBaseline = "top";

	for (let i = 0; i < words.length; i++) {
		// Add the words centered v/h on the canvas with space between lines
		let xPos = (emojiSize - context.measureText(words[i]).width) / 2;
		let yPos = firstLineOffset + (i * (spaceBetweenLines + fontSize));
		context.fillText(words[i], xPos, yPos);
	}

	const imageUrl = canvas.toDataURL();
	const download = document.getElementById("download");
	download.href = imageUrl;
	download.download = `${emojiText.replace(/ /g,"_")}.png`;
	downloadButton.disabled = false;

	const image = document.getElementById("result");
	image.setAttribute("src", imageUrl);
	canvas.remove();

	function generateTextSize(min, max) {
		if (max - min < 1) return min;
		let testSize = min + ((max - min) / 2); // Find half interval
		context.font = `${testSize}px ${fontface}`;
		let measureTest = context.measureText(longestWord).width;

		let tooWide = measureTest > emojiSize;
		let tooTall = testSize * words.length + lineSpacing > emojiSize;
		let tooLarge = tooWide || tooTall;
		return generateTextSize(tooLarge ? min : testSize, tooLarge ? testSize : max);
	}
}