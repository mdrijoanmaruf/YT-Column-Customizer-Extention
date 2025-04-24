document.addEventListener('DOMContentLoaded', function() {
  const columnInput = document.getElementById('columnCount');
  const applyButton = document.getElementById('saveButton');
  const decreaseButton = document.querySelector('.decrease');
  const increaseButton = document.querySelector('.increase');
  const resetButton = document.getElementById('resetButton');
  const previewGrid = document.getElementById('previewGrid');

  function getRandomPastelColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 60%, 80%)`;
  }

  function initializePreview(columnCount) {
    previewGrid.innerHTML = '';
    const totalItems = columnCount * 3;
    
    for (let i = 0; i < totalItems; i++) {
      const item = document.createElement('div');
      item.className = 'preview-item';
      item.style.backgroundColor = getRandomPastelColor();
      item.style.border = '1px solid rgba(0,0,0,0.1)';
      previewGrid.appendChild(item);
    }
  }

  function updatePreview(columnCount) {
    previewGrid.style.gridTemplateColumns = `repeat(${columnCount}, 1fr)`;
    initializePreview(columnCount);
  }

  function updateColumnCount(columnCount) {
    chrome.storage.sync.set({ columnCount: columnCount });
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { 
        action: 'updateColumns', 
        columnCount: columnCount 
      });
    });
  }

  chrome.storage.sync.get(['columnCount'], function(result) {
    const defaultColumns = 3;
    const columnCount = result.columnCount || defaultColumns;
    columnInput.value = columnCount;
    updatePreview(columnCount);
  });

  columnInput.addEventListener('input', function() {
    const value = parseInt(this.value);
    if (value >= 1 && value <= 10) {
      updatePreview(value);
      updateColumnCount(value);
    }
  });

  decreaseButton.addEventListener('click', function() {
    const currentValue = parseInt(columnInput.value);
    if (currentValue > 1) {
      columnInput.value = currentValue - 1;
      updatePreview(currentValue - 1);
      updateColumnCount(currentValue - 1);
    }
  });

  increaseButton.addEventListener('click', function() {
    const currentValue = parseInt(columnInput.value);
    if (currentValue < 10) {
      columnInput.value = currentValue + 1;
      updatePreview(currentValue + 1);
      updateColumnCount(currentValue + 1);
    }
  });

  resetButton.addEventListener('click', function() {
    const defaultColumns = 3;
    columnInput.value = defaultColumns;
    updatePreview(defaultColumns);
    updateColumnCount(defaultColumns);
  });

  applyButton.textContent = 'Apply';
  applyButton.addEventListener('click', function() {
    window.close();
  });
});