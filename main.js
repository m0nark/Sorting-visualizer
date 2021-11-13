const arrayDiv = document.querySelector("#array");
const inputSize = document.querySelector("#size-slider");
const sortForm = document.querySelector("form");
var generateButton = document.querySelector("#generator");
generateButton.onclick = generateNew;
var sortButton = document.querySelector("#sort");
sortButton.onclick = sort;
var breakFlag = false;
var isSorting = false;
let array = [];

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRand(lowerLimit, upperLimit) {
	range = upperLimit - lowerLimit;
	return (Math.floor(Math.random() * range) % range) + lowerLimit;
}

function DataNode(number) {
	this.number = number;
	this.span = document.createElement("span");
	this.span.classList.add("element");
	this.span.style.height = number * 5 + "px";
	this.toggleHighlight = function () {
		this.span.classList.toggle("highlighted");
	};
	this.setHeight = function () {
		this.span.style.height = this.number * 5 + "px";
	};
}

function swapNodes(a, b) {
	var temp = a.number;
	a.number = b.number;
	b.number = temp;
	a.setHeight();
	b.setHeight();
}

function removeHighlights() {
	array.forEach((dNode) => {
		dNode.span.classList.remove("highlighted");
	});
}

function generateNew() {
	if (isSorting) breakFlag = true;
	var size = inputSize.value;
	const width = arrayDiv.clientWidth / size;
	arrayDiv.innerHTML = "";
	array = [];
	for (i = 0; i < size; i++) {
		dNode = new DataNode(getRand(1, 100));
		dNode.span.style.width = width + "px";
		arrayDiv.appendChild(dNode.span);
		array.push(dNode);
	}
}

async function selectionSort() {
	sortButton.disabled = true;
	for (var i = 0; i < array.length && !breakFlag; i++) {
		var min = i;
		for (var j = i + 1; j < array.length && !breakFlag; j++) {
			array[j].toggleHighlight();
			await sleep(1);
			if (array[min].number > array[j].number) min = j;
			array[j].toggleHighlight();
		}
		if (min != i) swapNodes(array[i], array[min]);
	}
	if (breakFlag) removeHighlights();
	isSorting = false;
	breakFlag = false;
	sortButton.disabled = false;
}

async function bubbleSort() {
	sortButton.disabled = true;
	for (var i = 0; i < array.length && !breakFlag; i++) {
		for (var j = 0; j < array.length - i - 1 && !breakFlag; j++) {
			array[j].toggleHighlight();
			await sleep(1);
			array[j].toggleHighlight();
			if (array[j].number > array[j + 1].number)
				swapNodes(array[j], array[j + 1]);
		}
	}
	if (breakFlag) removeHighlights();
	isSorting = false;
	breakFlag = false;
	sortButton.disabled = false;
}

async function insertionSort() {
	sortButton.disabled = true;
	for (var i = 1; i < array.length && !breakFlag; i++) {
		var key = array[i].number;
		var j = i - 1;
		while (j >= 0 && array[j].number > key && !breakFlag) {
			array[j].toggleHighlight();
			await sleep(1);
			array[j].toggleHighlight();
			array[j + 1].number = array[j].number;
			array[j + 1].setHeight();
			j--;
		}
		array[j + 1].number = key;
		array[j + 1].setHeight();
	}
	if (breakFlag) removeHighlights();
	isSorting = false;
	breakFlag = false;
	sortButton.disabled = false;
}

async function mergeSortHelper(l, r) {
	if (l < r && !breakFlag) {
		var mid = l + Math.floor((r - l) / 2);
		await mergeSortHelper(l, mid);
		await mergeSortHelper(mid + 1, r);
		var size1 = mid - l + 1;
		var size2 = r - mid;
		let arr1 = [];
		let arr2 = [];
		for (var i = l; i <= mid && !breakFlag; i++) {
			array[i].toggleHighlight();
			await sleep(5);
			array[i].toggleHighlight();
			arr1[i - l] = array[i].number;
		}
		for (var i = mid + 1; i <= r && !breakFlag; i++) {
			array[i].toggleHighlight();
			await sleep(5);
			array[i].toggleHighlight();
			arr2[i - mid - 1] = array[i].number;
		}
		var i = 0;
		var j = 0;
		var k = l;
		while (i < size1 && j < size2 && !breakFlag) {
			await sleep(1);
			if (arr1[i] < arr2[j]) array[k].number = arr1[i++];
			else array[k].number = arr2[j++];
			array[k].setHeight();
			k++;
		}
		while (i < size1 && !breakFlag) {
			array[k].number = arr1[i++];
			array[k].setHeight();
			k++;
		}
		while (j < size2 && !breakFlag) {
			array[k].number = arr2[j++];
			array[k].setHeight();
			k++;
		}
	}
}

async function mergeSort() {
	sortButton.disabled = true;
	await mergeSortHelper(0, array.length - 1);
	if (breakFlag) removeHighlights();
	isSorting = false;
	breakFlag = false;
	sortButton.disabled = false;
}

async function partition(l, r) {
	var x = array[l].number;
	var i = l;
	for (var j = l + 1; j <= r && !breakFlag; j++) {
		array[j].toggleHighlight();
		await sleep(1);
		array[j].toggleHighlight();
		if (array[j].number <= x) {
			i++;
			swapNodes(array[i], array[j]);
		}
	}

	swapNodes(array[i], array[l]);
	return i;
}

async function quickSortHelper(l, r) {
	if (l < r && !breakFlag) {
		var pivot = await partition(l, r);
		await quickSortHelper(l, pivot - 1);
		await quickSortHelper(pivot + 1, r);
	}
}

async function quickSort() {
	sortButton.disabled = true;
	await quickSortHelper(0, array.length - 1);
	if (breakFlag) removeHighlights();
	isSorting = false;
	breakFlag = false;
	sortButton.disabled = false;
}

function sort() {
	isSorting = true;
	var value = sortForm["sorting-algo"].value;
	if (value == null) return;
	else if (value == 0) selectionSort();
	else if (value == 1) bubbleSort();
	else if (value == 2) insertionSort();
	else if (value == 3) mergeSort();
	else quickSort();
}
