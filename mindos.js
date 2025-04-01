document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

class Mindos {
    constructor() {
        this.nodes = JSON.parse(localStorage.getItem('mindMap')) || [];
        this.loadMindMap();
    }

    addNode(title, level, parent, color) {
        if (!title) {
            alert('Please enter a node title.');
            return;
        }
        const node = { title, level: parseInt(level), parent, color };
        this.nodes.push(node);
        this.saveMindMap();
        this.updateUI();
    }

    saveMindMap() {
        localStorage.setItem('mindMap', JSON.stringify(this.nodes));
    }

    loadMindMap() {
        this.updateUI();
    }

    clearMindMap() {
        this.nodes = [];
        this.saveMindMap();
        this.updateUI();
    }

    updateUI() {
        const output = document.getElementById('mindMapOutput');
        output.innerHTML = this.buildMindMapHTML();

        const totalNodes = this.nodes.length;
        const depthLevel = this.nodes.length ? Math.max(...this.nodes.map(n => n.level)) : 0;
        document.getElementById('totalNodes').textContent = totalNodes;
        document.getElementById('depthLevel').textContent = depthLevel;
    }

    buildMindMapHTML() {
        const levels = {};
        this.nodes.forEach(node => {
            if (!levels[node.level]) levels[node.level] = [];
            levels[node.level].push(node);
        });

        let html = '<ul>';
        for (let level = 1; level <= Math.max(...Object.keys(levels).map(Number)); level++) {
            if (levels[level]) {
                levels[level].forEach(node => {
                    const indent = (node.level - 1) * 20;
                    html += `<li style="margin-left: ${indent}px; color: ${node.color};">${node.title} ${node.parent ? `(Parent: ${node.parent})` : ''}</li>`;
                });
            }
        }
        html += '</ul>';
        return html;
    }
}

const mindos = new Mindos();

function addNode() {
    const title = document.getElementById('nodeTitle').value;
    const level = document.getElementById('nodeLevel').value;
    const parent = document.getElementById('nodeParent').value;
    const color = document.getElementById('nodeColor').value;
    mindos.addNode(title, level, parent, color);
}

function clearMindMap() {
    mindos.clearMindMap();
}
