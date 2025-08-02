document.addEventListener('DOMContentLoaded', () => {
	const DEFAULT_CELL_SIZE = 40;
	const DEFAULT_GRID_SIZE = 10;
	const DEAD = 0;
	const LIVE = 1;

	const startButton = document.getElementById('start');
	const gridContainer = document.getElementById('grid');
	const cellElements = [];
	let grid = createGrid();
	let gridSize = DEFAULT_GRID_SIZE;
	renderGridUI();

	startButton.addEventListener('click', () => {
		startLife();
	});

	function createGrid() {
		return [...Array(DEFAULT_GRID_SIZE)].map(() => {
			return Array(DEFAULT_GRID_SIZE).fill(DEAD);
		});
	}

	function renderGridUI() {
		gridContainer.innerHTML = '';
		gridContainer.style.display = 'grid';
		gridContainer.style.gridTemplateColumns = `repeat(${grid.length}, ${DEFAULT_CELL_SIZE}px)`;
		for (let row = 0; row < grid.length; row++) {
			const rowCells = [];
			for (let col = 0; col < grid[row].length; col++) {
				const cell = document.createElement('div');
				cell.classList.add('cell');
				cell.style.width = `${DEFAULT_CELL_SIZE}px`;
				cell.style.height = `${DEFAULT_CELL_SIZE}px`;
                if (grid[row][col] === LIVE) {
                    cell.classList.add('live');
                }
				cell.addEventListener('click', () => {
					grid[row][col] = grid[row][col] === DEAD ? LIVE : DEAD;
					cell.classList.toggle('live');
				});
				gridContainer.appendChild(cell);
				rowCells.push(cell);
			}
			cellElements.push(rowCells);
		}
	}

	function startLife() {
		const interval = setInterval(() => {
			const newGrid = grid.map((row) => row.slice());

			for (let row = 0; row < gridSize; row++) {
				for (let col = 0; col < gridSize; col++) {
					const neighbors = getNeighborCount(row, col);

					if (grid[row][col] === DEAD && neighbors === 3) {
						newGrid[row][col] = LIVE;
					}

					if (
						grid[row][col] === LIVE &&
						(neighbors <= 1 || neighbors >= 4)
					) {
						newGrid[row][col] = DEAD;
					}
				}
			}

			grid = newGrid;
			renderGridUI();
		}, 2000);
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
