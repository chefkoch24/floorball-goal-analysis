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
    var torart = ''
    for (i = 0; i < goals.length; i++) {
        g = goals[i]
        if (g.fill == 'blue') {
            torart = 'Tor';
        } else {
            torart = 'Gegentor';
        }
        row = [g.originX, g.originY, g.left, g.top, g.videolink, g.situation, g.drittel, torart, gegner, g.score, location]
        row = row.join(",");
        csvContent += row + "\r\n";
    }
    a = document.createElement('a');
    var encodedUri = encodeURI(csvContent);
    a.setAttribute('download', 'export');
    a.href = encodedUri;
    a.click();
}

function importData() {
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';
    fileInput.onchange = function (event) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            var lines = contents.split('\n');
            var headers = lines[0].split(',');
            for (var i = 1; i < lines.length; i++) {
                var row = lines[i].split(',');
                if (row.length !== headers.length) {
                    console.error('Invalid CSV row:', row);
                    continue;
                }
                var positionData = {};
                for (var j = 0; j < headers.length; j++) {
                    positionData[headers[j]] = row[j];
                }
                if (positionData.originX != '-'){
                    if ((positionData.torart === 'Tor' && parseInt(positionData.left) > canvas.width/2) ||(positionData.torart === 'Gegentor' && parseInt(positionData.left) < canvas.width/2)){
                        positionData = mirrorDataPoint(positionData)
                    }
                    createCircleFromPositionData(positionData);
                }
                
            }
        };
        reader.readAsText(file);
    };
    fileInput.click();
}

function mirrorDataPoint(dataPoint) {
    var verticalMiddleline = 387.5; // hard-coded as the canvas is not centered properly
    var horizontalMiddleline = 202.5;
  
    // Calculate the mirrored position
    var mirroredTop = horizontalMiddleline - (dataPoint.top - horizontalMiddleline);
    var mirroredLeft = verticalMiddleline - (dataPoint.left - verticalMiddleline);
     
    // Create a new mirrored data point
    dataPoint.left = mirroredLeft;
    dataPoint.top = mirroredTop;
  
    return dataPoint;
  }

function createCircleFromPositionData(positionData) {
    var circle = new fabric.Circle({
        radius: 10,
        fill: positionData.torart === 'Tor' ? 'blue' : 'red',
        originX: positionData.originX,
        originY: positionData.originY,
        left: parseInt(positionData.left),
        top: parseInt(positionData.top),
        videolink: positionData.videolink,
        situation: positionData.situation,
        drittel: positionData.drittel,
        score: positionData.spielstand
    });
    circle.hasControls = false;
    canvas.add(circle);
}

function saveAsPng() {
    var imageUrl = canvas.toDataURL({
        format: 'png',
        quality: 0.8
    });
    a = document.createElement('a');
    a.href = imageUrl;
    a.setAttribute('download', 'image');
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
