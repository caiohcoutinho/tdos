var SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = 600;

var config = {
    type: Phaser.AUTO,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function drawLineByPoints(graphics, path){
    var size = _.size(path);
    var point1 = path[0];
    for(var i = 1; i < size; i++){
        var diff = path[i];
        var point2 = addPointAndDiff(point1, diff);
        var line = new Phaser.Geom.Line(point1[0], point1[1],
         point2[0], point2[1]);
        graphics.strokeLineShape(line);
        point1 = point2;
    }
}

function preload ()
{
    this.load.image('worm', 'assets/worm.png');
    this.load.image('background', 'assets/background.png');
}

var addPointAndDiff = function(point, diff){
    return [point[0]+diff[0], point[1]+diff[1]];
}

var BotWorm = function(scene, initialPosition, path){
    var botWorm = scene.physics.add.sprite( 
        initialPosition[0], initialPosition[1], 'worm');    
    botWorm.setData('path', path);
    botWorm.setData('lastPath', 0);
    botWorm.setData('goal', path[0]);
    botWorm.physicsBodyType = Phaser.Physics.ARCADE;
    botWorm.updateGoal = function(){
        if(!this.active){
            return;
        }
        var path = this.getData('path');
        this.setData('lastPath', this.getData('lastPath')+1);
        if(_.size(path) < this.getData('lastPath')+1){
            this.setData('goal', undefined);
            this.destroy();
            scene.decreaseScore(20);
            return;
        }
        var nextDiff = path[this.getData('lastPath')];
        var goal = this.getData('goal');
        this.body.position.x = goal[0]-this.body.halfWidth;
        this.body.position.y = goal[1]-this.body.halfHeight;
        var position = botWorm.body.position;
        goal = addPointAndDiff(goal, nextDiff);
        this.setData('goal', goal);
        this.body.velocity = new Phaser.Math.Vector2(0, 0);
    }
    var acceleration = 800;
    botWorm.body.maxVelocity = new Phaser.Math.Vector2(400, 400);
    botWorm.updateAcceleration = function(){
        if(!this.active){
            return;
        }
        var goal = this.getData('goal');
        if(_.isUndefined(goal)){
            this.body.acceleration = new Phaser.Math.Vector2(0, 0);
            return;
        }
        var position = this.body.position;
        var halfWidth = this.body.halfWidth;
        var halfHeight = this.body.halfHeight;
        this.body.acceleration = new Phaser.Math.Vector2(
            goal[0] > position.x+halfWidth ? acceleration: 
                goal[0] < position.x+halfWidth ? -acceleration : 0,
            goal[1] > position.y+halfHeight ? acceleration: 
                goal[1] < position.y+halfHeight ? -acceleration : 0
        );
    }
    botWorm.setScale(0.8);
    botWorm.updateGoal();
    botWorm.updateAcceleration();
    return botWorm;
}

function update(){

    if(Math.random() < 0.03){
        this.botWorms.push(new BotWorm(this, this.path[0], this.path));
    }

    _.each(this.botWorms, function(botWorm){
        var goal = botWorm.getData('goal');
        if(!_.isUndefined(goal) && Phaser.Geom.Intersects.RectangleToRectangle(botWorm.getBounds(), 
            new Phaser.Geom.Rectangle(goal[0]-1, goal[1]-1, 2, 2))){
            botWorm.updateGoal();
        }
        botWorm.updateAcceleration();
    });
}

function create ()
{
    this.add.image(400, 300, 'background');

    this.score = 1000;

    this.scoreText = this.add.text(16, 16, 'Score: '+this.score, {
     fontSize: '32px', 
     fill: '#306844',
     fontWeight: 'bold'
    });

    this.decreaseScore = function(points){
        this.score -= points;
        if(this.score < 0){
            this.score = 0;
        }
        this.scoreText.setText('Score: '+this.score);
    }

    this.addScore = function(points){
        this.score += points;
        this.scoreText.setText('Score: '+this.score);
    }

    this.theNet = this.add.graphics();
    var color = 0x00a88f;
    var thickness = 2;
    var alpha = 1;

    this.theNet.lineStyle(thickness, color, alpha);

    this.path = _.map([
        [0,4], 
        [4,0], [0,-2], [-2,0], [0,3],
        [4,0], [0,-4], [-3,0], [0,6],
        [2,0], [0,-5], [2,0], [0,4],
        [-3,0], [0,2], [6,0]
    ], function(point){
        return [point[0]*SCREEN_WIDTH/10, 
                point[1]*SCREEN_HEIGHT/10]
    });
    drawLineByPoints(this.theNet, this.path);

    this.botWorms = [];
}