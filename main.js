const gridX = 30;
const gridY = 30;

const increm = [{x:0,y:-1},{x:1,y:0},{x:0,y:1},{x:-1,y:0}];

var app = new Vue({
    el: '#app',
    data: {
        snake: [[parseInt(gridX/2), parseInt(gridY/2)]],
        snaks: [[4,4]],
        dir: undefined,
        len: 1,
        state: 'idle',
    },
    computed: {
        grid: function() {
            
            // Define grid
            let grid = [];
            for (var y = 0; y < gridY; y++) {
                let row = [];
                for (var x = 0; x < gridX; x++) { row.push(''); }
                grid.push(row);
            }
            
            // Mark snake locations
            this.snake.forEach(part => {
                if (part == this.snake[0]) grid[part[1]][part[0]] += 'head ';
                grid[part[1]][part[0]] += 'snake ';
            })
            
            // Mark snack locations
            this.snaks.forEach(snak => {
                grid[snak[1]][snak[0]] += 'snack ';
            });
            
            return grid;
        }
    }
});

setInterval(tick, 100);

function tick() {
    if (app.dir != undefined && app.state != 'dead' && app.state != 'win') {
        
        // Predict next step of snake
        let dot = [app.snake[0][0] + increm[app.dir].x, app.snake[0][1] + increm[app.dir].y];

        // Check if player died
        let dead = false;
        if (dot[0] < 0 || dot[1] < 0 || dot[0] >= gridX || dot[1] >= gridY ) dead = true;
        app.snake.forEach(part => {
            if (part != app.snake[0]) {
                if (part[0] == app.snake[0][0] && part[1] == app.snake[0][1]) dead = true;
            }
        })

        // If not dead, proceed to next block
        if (dead) app.state = 'dead';
        else {
            
            // Check for snacks
            let onSnack = false;
            app.snaks.forEach(snak => {
                if (dot[0] == snak[0] && dot[1] == snak[1]) onSnack = true;
            });
            if (onSnack) {
                app.len++;
                app.snaks.pop();
                app.snaks.push([parseInt(Math.random()*gridX),parseInt(Math.random()*gridY)]);
            }
            
            // Move snake
            app.snake.unshift(dot);
            if (app.snake.length > app.len) app.snake.pop();
        }
    }
}

// Check for key presses
document.onkeydown = checkKey;
function checkKey(e) {
    e = e || window.event;
    
    let newDir;
    if (e.keyCode == '38') newDir = 0;
    else if (e.keyCode == '40') newDir = 2;
    else if (e.keyCode == '37') newDir = 3;
    else if (e.keyCode == '39') newDir = 1;
    
    // Check if we can move that direction
    if (newDir != undefined) {
        if (!(app.snake.length > 1 && app.snake[1][0] == (app.snake[0][0]+increm[newDir].x) && app.snake[1][1] == (app.snake[0][1]+increm[newDir].y))) {
            app.dir = newDir;
            tick();
        }
    }
    
}