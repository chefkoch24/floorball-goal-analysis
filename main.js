var canvas = new fabric.Canvas('canvas');
var d = Date.now();

canvas.setBackgroundImage('assets/floorball-layout.png', canvas.renderAll.bind(canvas), {
    top: 0,
    left: 0,
    originX: 'left',
    originY: 'top',
    scaleX: 1,
    scaleY: 1
});
canvas.renderAll();


function addGoal() {
    goal = new fabric.Circle({
        radius: 10,
        fill: 'blue',
        top: 100,
        left: 100,
        time: d
    });
    goal.hasControls = false;
    canvas.add(goal);
}

function addGoalAgainst() {
    goalAgainst = new fabric.Circle({
        radius: 10,
        fill: 'red',
        top: 100,
        left: 100,
        time: d
    })
    goalAgainst.hasControls = false;
    canvas.add(goalAgainst);
}

/*click to move the goal*/
canvas.on('mouse:down', function (options) {
    if (options.target) {
        var obj = options.target
        document.getElementById('videolink-edit').value = obj.videolink;
        document.getElementById('situation-edit').value = obj.situation;
        document.getElementById('drittel-edit').value = obj.drittel;
        document.getElementById('score-edit').value = obj.score;
        // display editing section
        document.getElementById('goal-info-edit').style.display = 'block';
    } else {
        // hide editing section
        document.getElementById('goal-info-edit').style.display = 'none';
    }
});

function deleteGoal() {
    obj = canvas.getActiveObject();
    canvas.remove(obj);
    document.getElementById('goal-info-edit').style.display = 'none';
}


function saveAndExport() {
    goals = canvas.getObjects();
    var csvContent = "data:text/csv;charset=utf-8,";
    var row = ['originX', 'originY', 'left', 'top', 'videolink', 'situation', 'drittel', 'torart', 'gegner', 'spielstand', 'spielort'];
    row = row.join(",");
    csvContent += row + "\r\n";
    var gegner = document.getElementById('opponent').value;
    var location = document.getElementById('home');
    if (location.checked) {
        location = 'Heim';
    } else {
        location = 'Auswärts';
    }
    for (i = 0; i < goals.length; i++) {
        g = goals[i]
        if (g.fill == 'blue') {
            torart = 'tor';
        } else {
            torart = 'gegentor';
        }
        row = [g.originX, g.originY, g.left, g.top, g.videolink, g.situation, g.drittel, torart, gegner, g.score, location]
        row = row.join(",");
        csvContent += row + "\r\n";
    }
    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
}

function saveAsPng() {
    var imageUrl = canvas.toDataURL({
        format: 'png',
        quality: 0.8
    });
    a = document.createElement('a');
    a.download = name;
    a.href = imageUrl;
    a.click();
}

/* Modal logic*/
function saveGoalInfo() {
    goals = canvas.getObjects().sort(function (a, b) {
        return a.time > b.time
    });
    goals.reverse();

    var goal = goals[0];
    var videolink = document.getElementById('videolink').value;
    var situation = document.getElementById('situation').value;
    var drittel = document.getElementById('drittel').value;
    var score = document.getElementById('score').value;
    goals[0].set({
        'videolink': videolink,
        'situation': situation,
        'drittel': drittel,
        'score': score
    })
}
