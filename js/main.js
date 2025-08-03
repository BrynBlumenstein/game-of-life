document.addEventListener('DOMContentLoaded', () => {
	const DEFAULT_CELL_SIZE = 20; // 20px
	const DEFAULT_GRID_SIZE = 40; // 40x40 cells
	const DEFAULT_UPDATE_DELAY = 100; // 100ms
	const DEAD = 0;
	const LIVE = 1;

	const gridContainer = document.getElementById('grid');
	const populationSpan = document.getElementById('population');
	const generationSpan = document.getElementById('generation');
	const startButton = document.getElementById('start');
	const stopButton = document.getElementById('stop');
	const clearButton = document.getElementById('clear');

	let gridSize = DEFAULT_GRID_SIZE;
	let updateDelay = DEFAULT_UPDATE_DELAY;
	let grid = createGrid();
	let population = 0;
	let generation = 0;
	let intervalId = null;

	renderUI();

	startButton.addEventListener('click', start);

	stopButton.addEventListener('click', stop);

	clearButton.addEventListener('click', clear);

	function createGrid() {
		return [...Array(DEFAULT_GRID_SIZE)].map(() => {
			return Array(DEFAULT_GRID_SIZE).fill(DEAD);
		});
	}

	function start() {
		intervalId ??= setInterval(runGeneration, updateDelay);
		startButton.disabled = true;
		stopButton.disabled = false;
	}

	function stop() {
		clearInterval(intervalId);
		intervalId = null;
		stopButton.disabled = true;
		startButton.disabled = false;
	}

	function clear() {
		stop();
		grid = createGrid();
		population = 0;
		generation = 0;
		renderUI();
	}

	function renderUI() {
		renderPopulation();
		renderGeneration();
		renderGrid();
	}

	function renderPopulation() {
		populationSpan.textContent = population;
	}

	function renderGeneration() {
		generationSpan.textContent = generation;
	}

	function renderGrid() {
		gridContainer.innerHTML = '';
		gridContainer.style.gridTemplateColumns = `repeat(${grid.length}, ${DEFAULT_CELL_SIZE}px)`;

		for (let row = 0; row < grid.length; row++) {
			for (let col = 0; col < grid[row].length; col++) {
				const cell = document.createElement('div');
				cell.classList.add('cell');
				cell.style.width = `${DEFAULT_CELL_SIZE}px`;
				cell.style.height = `${DEFAULT_CELL_SIZE}px`;

				if (grid[row][col] === LIVE) {
					cell.classList.add('live');
				}

				cell.addEventListener('click', () =>
					handleCellClick(cell, row, col)
				);

				gridContainer.appendChild(cell);
			}
		}
	}

	function handleCellClick(cell, row, col) {
		if (grid[row][col] === DEAD) {
			grid[row][col] = LIVE;
			population++;
		} else {
			grid[row][col] = DEAD;
			population--;
		}

		cell.classList.toggle('live');
		renderPopulation();
	}

	function runGeneration() {
		const newGrid = grid.map((row) => row.slice());

		for (let row = 0; row < gridSize; row++) {
			for (let col = 0; col < gridSize; col++) {
				const neighbors = getNeighborCount(row, col);

				if (grid[row][col] === DEAD && neighbors === 3) {
					newGrid[row][col] = LIVE;
					population++;
				}

				if (
					grid[row][col] === LIVE &&
					(neighbors <= 1 || neighbors >= 4)
				) {
					newGrid[row][col] = DEAD;
					population--;
				}
			}
		}

		grid = newGrid;
		generation++;
		renderUI();
	}

	function getNeighborCount(row, col) {
		let neighbors = 0;

		for (let i = row - 1; i <= row + 1; i++) {
			for (let j = col - 1; j <= col + 1; j++) {
				if (i === row && j === col) {
					continue;
				}

				if (i < 0 || i >= gridSize || j < 0 || j >= gridSize) {
					continue;
				}

				if (grid[i][j]) {
					neighbors++;
				}
			}
		}

		return neighbors;
	}
});
