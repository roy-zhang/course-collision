// Generated by CoffeeScript 1.6.3
(function() {
  var NUKE_COST, NUKE_VELOCITY, PREP_TIMER_VALUE, Q, ROCKET_COST, ROCKET_VELOCITY, SETTLERS_COST, SETTLERS_VELOCITY, START_TIMER_VALUE, TRANSITION_TIMER_VALUE, assets, buildCircleMask, costForShipType, monitorForRoundEnd, resetState, velocityForShipType;

  buildCircleMask = function(radius, steps, centerX, centerY) {
    return _.times(steps, function(i) {
      var x, y;
      x = centerX + radius * Math.cos(Math.PI * i / steps * 2 - Math.PI / 2);
      y = centerY + radius * Math.sin(Math.PI * i / steps * 2 - Math.PI / 2);
      return [x, y];
    });
  };

  START_TIMER_VALUE = 30;

  PREP_TIMER_VALUE = 3;

  TRANSITION_TIMER_VALUE = 3;

  SETTLERS_VELOCITY = 60;

  ROCKET_VELOCITY = 45;

  NUKE_VELOCITY = 75;

  SETTLERS_COST = 1;

  ROCKET_COST = 1;

  NUKE_COST = 5;

  velocityForShipType = function(type) {
    switch (type) {
      case 'rocket':
        return ROCKET_VELOCITY;
      case 'settlers':
        return SETTLERS_VELOCITY;
      case 'nuke':
        return NUKE_VELOCITY;
      default:
        return 0;
    }
  };

  costForShipType = function(type) {
    switch (type) {
      case 'rocket':
        return ROCKET_COST;
      case 'settlers':
        return SETTLERS_COST;
      case 'nuke':
        return NUKE_COST;
      default:
        return 0;
    }
  };

  monitorForRoundEnd = function() {
    if (Q('BlueShip').length || Q('RedShip').length) {
      return setTimeout(function() {
        return monitorForRoundEnd();
      }, 100);
    } else {
      return Q.stageScene('roundOver', 1, {});
    }
  };

  window.Q = Q = Quintus({
    development: true,
    audioSupported: ['mp3']
  }).include('Sprites, Scenes, Input, 2D, Touch, Anim, UI, Audio').setup({
    width: 800,
    height: 800
  }).enableSound().controls().touch().setup();

  Q.gravityX = 0;

  Q.gravityY = 0;

  resetState = function() {
    return Q.state.reset({
      redInitialCash: 100,
      redInitialSettlers: 10,
      redFinalCash: 0,
      redFinalSettlers: 0,
      blueInitialCash: 100,
      blueInitialSettlers: 10,
      blueFinalCash: 0,
      blueFinalSettlers: 0,
      blueOnLeft: true,
      round: 1,
      ai: false,
      backgroundAngle: 90,
      aiStrat: 'hunt',
      timefourths: 0,
      needTransition: false,
      rotateSpeed: 0.01,
      timer: START_TIMER_VALUE,
      prepTimer: PREP_TIMER_VALUE,
      mode: 'RoundStart'
    });
  };

  resetState();

  Q.input.keyboardControls({
    A: 'launchBlueSupply',
    S: 'launchBlueSettler',
    D: 'launchBlueNuke',
    Z: 'launchBlueSupply',
    X: 'launchBlueSettler',
    C: 'launchBlueNuke',
    LEFT: 'launchRedSupply',
    DOWN: 'launchRedSettler',
    RIGHT: 'launchRedNuke'
  });

  Q.Sprite.extend('RotatingBackground', {
    init: function(p) {
      this._super(p, {
        asset: 'level1.png',
        x: Q.width / 2,
        y: Q.height / 2,
        scale: 1.15,
        angle: Q.state.get('backgroundAngle')
      });
      return this.p.type = Q.SPRITE_NONE;
    },
    step: function(dt) {
      return this.p.angle = (this.p.angle + Q.state.get('rotateSpeed')) % 360;
    }
  });

  Q.MovingSprite.extend('BlueShip', {
    init: function(r) {
      var shipType;
      shipType = r.shipType;
      if (shipType === 'rocket') {
        if (Q.state.get('blueOnLeft')) {
          this._super(r, {
            asset: 'blueRocket.png',
            x: Q.width * (0.12 + (Math.random() * 0.05)),
            y: Q.height * 0.75,
            angle: 45,
            scale: 0.2
          });
        } else {
          this._super(r, {
            asset: 'blueRocket.png',
            x: Q.width * (0.72 + (Math.random() * 0.05)),
            y: Q.height * 0.75,
            angle: -45,
            scale: 0.2
          });
        }
        this.add('2d');
        this.p.points = [[66, 0], [66, 266]];
      } else if (shipType === 'settlers') {
        if (Q.state.get('blueOnLeft')) {
          this._super(r, {
            sprite: 'blueSettlers',
            sheet: 'blueSettlers',
            x: Q.width * (0.05 + (Math.random() * 0.05)),
            y: Q.height * 0.75,
            angle: 45,
            scale: 0.3
          });
        } else {
          this._super(r, {
            sprite: 'blueSettlers',
            sheet: 'blueSettlers',
            x: Q.width * (0.79 + (Math.random() * 0.05)),
            y: Q.height * 0.75,
            angle: -45,
            scale: 0.3
          });
        }
        this.add('2d, animation');
        this.play('blueSettlers');
        this.p.points = [[46, 20], [46, 120]];
      } else {
        if (Q.state.get('blueOnLeft')) {
          this._super(r, {
            asset: 'blueNuke.png',
            x: Q.width * (0.19 + (Math.random() * 0.05)),
            y: Q.height * 0.75,
            angle: 45,
            scale: 0.2
          });
        } else {
          this._super(r, {
            asset: 'blueNuke.png',
            x: Q.width * (0.65 + (Math.random() * 0.05)),
            y: Q.height * 0.75,
            angle: -45,
            scale: 0.2
          });
        }
        this.add('2d');
        this.p.points = [[66, 0], [66, 266]];
      }
      this.p.cx = 0;
      this.p.cy = 0;
      if (Q.state.get('blueOnLeft')) {
        this.p.vx = velocityForShipType(shipType);
      } else {
        this.p.vx = velocityForShipType(shipType) * -1;
      }
      this.p.vy = velocityForShipType(shipType) * -1;
      Q.audio.play('shoot.mp3');
      return this.on('hit', function(collision) {
        if (collision.obj.isA('BlueShip')) {
          this.p.vx = velocityForShipType(shipType);
          this.p.vy = velocityForShipType(shipType) * -1;
        }
        if (!this.isDestroyed) {
          if (collision.obj.isA('RedShip') || collision.obj.isA('NuclearExplosionAnimation')) {
            if (shipType === 'nuke') {
              Q.audio.play('nuke.mp3');
              Q.stage().insert(new Q.NuclearExplosionAnimation({
                x: this.p.x,
                y: this.p.y
              }));
            } else {
              Q.audio.play('explosion.mp3');
              Q.stage().insert(new Q.ExplosionAnimation({
                x: this.p.x + 5,
                y: this.p.y + 25
              }));
            }
          } else if (collision.obj.isA('BlueStation')) {
            Q.state.inc((shipType === 'settlers' ? 'blueFinalSettlers' : 'blueFinalCash'), costForShipType(shipType));
          }
          return this.destroy();
        }
      });
    }
  });

  Q.MovingSprite.extend('BlueStation', {
    init: function(s) {
      if (Q.state.get('blueOnLeft')) {
        this._super(s, {
          asset: 'planetb2.png',
          x: Q.width * 0.85,
          y: Q.height * 0.15
        });
      } else {
        this._super(s, {
          asset: 'planetb1.png',
          x: Q.width * 0.15,
          y: Q.height * 0.15
        });
      }
      return this.p.points = buildCircleMask(100, 16, 0, 0);
    }
  });

  Q.MovingSprite.extend('BluePlanet', {
    init: function(p) {
      if (Q.state.get('blueOnLeft')) {
        this._super(p, {
          asset: 'planetb1.png',
          x: Q.width * 0.15,
          y: Q.height * 0.80
        });
      } else {
        this._super(p, {
          asset: 'planetb2.png',
          x: Q.width * 0.85,
          y: Q.height * 0.80
        });
      }
      this.p.type = Q.SPRITE_UI;
      this.p.vy = 0;
      Q.input.on('launchBlueSupply', this, 'launchBlueSupply');
      Q.input.on('launchBlueSettler', this, 'launchBlueSettler');
      Q.input.on('launchBlueNuke', this, 'launchBlueNuke');
      return Q.state.on('change.mode', this, 'modeUpdated');
    },
    launchBlueSupply: function() {
      var shipType;
      if (Q.state.get('mode') === 'Playing') {
        shipType = 'rocket';
        if (Q.state.get('blueInitialCash') > costForShipType(shipType) - 1) {
          Q.state.dec('blueInitialCash', costForShipType(shipType));
          return Q.stage().insert(new Q.BlueShip({
            shipType: shipType
          }));
        }
      }
    },
    launchBlueSettler: function() {
      var shipType;
      if (Q.state.get('mode') === 'Playing') {
        shipType = 'settlers';
        if (Q.state.get('blueInitialSettlers') > costForShipType(shipType) - 1) {
          Q.state.dec('blueInitialSettlers', costForShipType(shipType));
          return Q.stage().insert(new Q.BlueShip({
            shipType: shipType
          }));
        }
      }
    },
    launchBlueNuke: function() {
      var shipType;
      if (Q.state.get('mode') === 'Playing') {
        shipType = 'nuke';
        if (Q.state.get('blueInitialCash') > costForShipType(shipType) - 1) {
          Q.state.dec('blueInitialCash', costForShipType(shipType));
          return Q.stage().insert(new Q.BlueShip({
            shipType: shipType
          }));
        }
      }
    },
    modeUpdated: function(mode) {
      if (mode === 'RoundEnd') {
        return this.p.vy = 5;
      }
    }
  });

  Q.MovingSprite.extend('RedShip', {
    init: function(r) {
      var shipType;
      shipType = r.shipType;
      if (shipType === 'rocket') {
        if (Q.state.get('blueOnLeft')) {
          this._super(r, {
            asset: 'redRocket.png',
            x: Q.width * (0.72 + (Math.random() * 0.05)),
            y: Q.height * 0.75,
            angle: -45,
            scale: 0.2
          });
        } else {
          this._super(r, {
            asset: 'redRocket.png',
            x: Q.width * (0.12 + (Math.random() * 0.05)),
            y: Q.height * 0.75,
            angle: 45,
            scale: 0.2
          });
        }
        this.add('2d');
        this.p.points = [[66, 0], [66, 266]];
      } else if (shipType === 'settlers') {
        if (Q.state.get('blueOnLeft')) {
          this._super(r, {
            sprite: 'redSettlers',
            sheet: 'redSettlers',
            x: Q.width * (0.79 + (Math.random() * 0.05)),
            y: Q.height * 0.75,
            angle: -45,
            scale: 0.3
          });
        } else {
          this._super(r, {
            sprite: 'redSettlers',
            sheet: 'redSettlers',
            x: Q.width * (0.05 + (Math.random() * 0.05)),
            y: Q.height * 0.75,
            angle: 45,
            scale: 0.3
          });
        }
        this.add('2d, animation');
        this.play('redSettlers');
        this.p.points = [[46, 20], [46, 120]];
      } else {
        if (Q.state.get('blueOnLeft')) {
          this._super(r, {
            asset: 'redNuke.png',
            x: Q.width * (0.65 + (Math.random() * 0.05)),
            y: Q.height * 0.75,
            angle: -45,
            scale: 0.2
          });
        } else {
          this._super(r, {
            asset: 'redNuke.png',
            x: Q.width * (0.19 + (Math.random() * 0.05)),
            y: Q.height * 0.75,
            angle: 45,
            scale: 0.2
          });
        }
        this.add('2d');
        this.p.points = [[66, 0], [66, 266]];
      }
      if (Q.state.get('blueOnLeft')) {
        this.p.vx = velocityForShipType(shipType) * -1;
      } else {
        this.p.vx = velocityForShipType(shipType);
      }
      this.p.vy = velocityForShipType(shipType) * -1;
      this.p.cx = 0;
      this.p.cy = 0;
      Q.audio.play('shoot2.mp3');
      return this.on('hit', function(collision) {
        if (collision.obj.isA('RedShip')) {
          this.p.vx = velocityForShipType(shipType) * -1;
          this.p.vy = velocityForShipType(shipType) * -1;
        }
        if (!this.isDestroyed) {
          if (collision.obj.isA('BlueShip') || collision.obj.isA('NuclearExplosionAnimation')) {
            if (shipType === 'nuke') {
              Q.audio.play('nuke.mp3');
              Q.stage().insert(new Q.NuclearExplosionAnimation({
                x: this.p.x,
                y: this.p.y
              }));
            } else {
              Q.audio.play('explosion.mp3');
              Q.stage().insert(new Q.ExplosionAnimation({
                x: this.p.x + 25,
                y: this.p.y + 25
              }));
            }
          } else if (collision.obj.isA('RedStation')) {
            Q.state.inc((shipType === 'settlers' ? 'redFinalSettlers' : 'redFinalCash'), costForShipType(shipType));
          }
          return this.destroy();
        }
      });
    }
  });

  Q.MovingSprite.extend('RedStation', {
    init: function(s) {
      if (Q.state.get('blueOnLeft')) {
        this._super(s, {
          asset: 'planetr2.png',
          x: Q.width * 0.15,
          y: Q.height * 0.15
        });
      } else {
        this._super(s, {
          asset: 'planetr1.png',
          x: Q.width * 0.85,
          y: Q.height * 0.15
        });
      }
      return this.p.points = buildCircleMask(100, 16, 0, 0);
    }
  });

  Q.MovingSprite.extend('RedPlanet', {
    init: function(p) {
      if (Q.state.get('blueOnLeft')) {
        this._super(p, {
          asset: 'planetr1.png',
          x: Q.width * 0.85,
          y: Q.height * 0.80
        });
      } else {
        this._super(p, {
          asset: 'planetr2.png',
          x: Q.width * 0.15,
          y: Q.height * 0.80
        });
      }
      this.p.type = Q.SPRITE_UI;
      this.p.vy = 0;
      Q.input.on('launchRedSupply', this, 'launchRedSupply');
      Q.input.on('launchRedSettler', this, 'launchRedSettler');
      Q.input.on('launchRedNuke', this, 'launchRedNuke');
      return Q.state.on('change.mode', this, 'modeUpdated');
    },
    launchRedSupply: function() {
      var shipType;
      if (Q.state.get('mode') === 'Playing') {
        shipType = 'rocket';
        if (Q.state.get('redInitialCash') > costForShipType(shipType) - 1) {
          Q.state.dec('redInitialCash', costForShipType(shipType));
          return Q.stage().insert(new Q.RedShip({
            shipType: shipType
          }));
        }
      }
    },
    launchRedSettler: function() {
      var shipType;
      if (Q.state.get('mode') === 'Playing') {
        shipType = 'settlers';
        if (Q.state.get('redInitialSettlers') > costForShipType(shipType) - 1) {
          Q.state.dec('redInitialSettlers', costForShipType(shipType));
          return Q.stage().insert(new Q.RedShip({
            shipType: shipType
          }));
        }
      }
    },
    launchRedNuke: function() {
      var shipType;
      if (Q.state.get('mode') === 'Playing') {
        shipType = 'nuke';
        if (Q.state.get('redInitialCash') > costForShipType(shipType) - 1) {
          Q.state.dec('redInitialCash', costForShipType(shipType));
          return Q.stage().insert(new Q.RedShip({
            shipType: shipType
          }));
        }
      }
    },
    modeUpdated: function(mode) {
      if (mode === 'RoundEnd') {
        return this.p.vy = 5;
      }
    }
  });

  Q.MovingSprite.extend('Sun', {
    init: function(s) {
      this._super(s, {
        asset: 'sun.png',
        x: Q.width * 0.5,
        y: Q.height * 0.75,
        scale: 1.5
      });
      this.p.vy = 0;
      this.p.type = Q.SPRITE_UI;
      return Q.state.on('change.mode', this, 'modeUpdated');
    },
    modeUpdated: function(mode) {
      if (mode !== 'Playing') {
        this.p.vy = 0;
      }
      if (mode === 'Playing') {
        return this.p.vy = (Q.height * 1.17 - 740) / START_TIMER_VALUE * -1;
      }
    }
  });

  Q.UI.Text.extend('Timer', {
    init: function(p) {
      this._super(p, {
        x: Q.width * 0.5,
        y: Q.height * 0.6,
        size: 40,
        label: 'Planetary Destruction in\n' + Q.state.get('timer'),
        color: 'red',
        align: 'center'
      });
      this.p.type = Q.SPRITE_UI;
      Q.state.on('change.timer', this, 'timeUpdated');
      return Q.state.on('change.mode', this, 'modeUpdated');
    },
    timeUpdated: function(time) {
      return this.p.label = 'Planetary Destruction in\n' + time.toString();
    },
    modeUpdated: function(mode) {
      if (mode === 'RoundEnd') {
        return this.destroy();
      }
    }
  });

  Q.UI.Text.extend('PrepTimer', {
    init: function(p) {
      this._super(p, {
        x: Q.width * 0.5,
        y: Q.height * 0.5,
        size: 40,
        label: 'Sun Approaching!\n Ready Launch in ' + Q.state.get('prepTimer'),
        color: 'yellow',
        align: 'center'
      });
      this.p.type = Q.SPRITE_UI;
      Q.state.on('change.prepTimer', this, 'timeUpdated');
      return Q.state.on('change.mode', this, 'modeUpdated');
    },
    timeUpdated: function(prepTime) {
      return this.p.label = 'Sun Approaching!\n Ready Launch in ' + prepTime.toString();
    },
    modeUpdated: function(mode) {
      var timer;
      timer = this;
      return setTimeout(function() {
        if (mode === 'Playing') {
          return timer.destroy();
        }
      }, 0);
    }
  });

  Q.Sprite.extend('ExplosionAnimation', {
    init: function(p) {
      var explosion;
      this._super(p, {
        sheet: 'explode',
        sprite: 'explode'
      });
      this.p.type = Q.SPRITE_UI;
      this.add('animation');
      this.play('explode');
      explosion = this;
      return setTimeout(function() {
        return explosion.destroy();
      }, 200);
    }
  });

  Q.Sprite.extend('NuclearExplosionAnimation', {
    init: function(p) {
      var explosion;
      this._super(p, {
        sheet: 'nukeExplode',
        sprite: 'nukeExplode'
      });
      this.p.points = buildCircleMask(50, 8, 0, 0);
      this.add('animation');
      this.play('nukeExplode');
      explosion = this;
      return setTimeout(function() {
        return explosion.destroy();
      }, 200);
    }
  });

  Q.Sprite.extend('PlanetExplosionAnimation', {
    init: function(p) {
      var explosion;
      this._super(p, {
        sheet: 'nukeExplode',
        sprite: 'nukeExplode',
        scale: 1
      });
      this.add('animation');
      this.play('planetExplode');
      explosion = this;
      return setTimeout(function() {
        return explosion.destroy();
      }, 1500);
    }
  });

  Q.UI.Text.extend('BlueStats', {
    buildBlueStatLabel: function() {
      return 'Cash:\t' + Q.state.get('blueInitialCash') + '\n' + 'Settlers:\t' + Q.state.get('blueInitialSettlers');
    },
    init: function(p) {
      this._super(p, {
        color: 'white',
        size: 16,
        label: this.buildBlueStatLabel(),
        align: 'left'
      });
      Q.state.on('change.blueInitialCash', this, 'updateStats');
      return Q.state.on('change.blueInitialSettlers', this, 'updateStats');
    },
    updateStats: function(_) {
      return this.p.label = this.buildBlueStatLabel();
    }
  });

  Q.UI.Text.extend('RedStats', {
    buildRedStatLabel: function() {
      return 'Cash:\t' + Q.state.get('redInitialCash') + '\n' + 'Settlers:\t' + Q.state.get('redInitialSettlers');
    },
    init: function(p) {
      this._super(p, {
        color: 'white',
        size: 16,
        label: this.buildRedStatLabel(),
        align: 'left'
      });
      Q.state.on('change.redInitialCash', this, 'updateStats');
      return Q.state.on('change.redInitialSettlers', this, 'updateStats');
    },
    updateStats: function(_) {
      return this.p.label = this.buildRedStatLabel();
    }
  });

  Q.UI.Text.extend('BlueFinalStats', {
    buildBlueStatLabel: function() {
      return 'Cash:\t' + Q.state.get('blueFinalCash') + '\n' + 'Settlers:\t' + Q.state.get('blueFinalSettlers');
    },
    init: function(p) {
      this._super(p, {
        color: 'white',
        size: 16,
        label: this.buildBlueStatLabel(),
        align: 'left'
      });
      Q.state.on('change.blueFinalCash', this, 'updateStats');
      return Q.state.on('change.blueFinalSettlers', this, 'updateStats');
    },
    updateStats: function(_) {
      return this.p.label = this.buildBlueStatLabel();
    }
  });

  Q.UI.Text.extend('RedFinalStats', {
    buildRedStatLabel: function() {
      return 'Cash:\t' + Q.state.get('redFinalCash') + '\n' + 'Settlers:\t' + Q.state.get('redFinalSettlers');
    },
    init: function(p) {
      this._super(p, {
        color: 'white',
        size: 16,
        label: this.buildRedStatLabel(),
        align: 'left'
      });
      Q.state.on('change.redFinalCash', this, 'updateStats');
      return Q.state.on('change.redFinalSettlers', this, 'updateStats');
    },
    updateStats: function(_) {
      return this.p.label = this.buildRedStatLabel();
    }
  });

  Q.scene('mainMenu', function(stage) {
    var leftContainer, playAiButton, playLocalButton, rightContainer;
    stage.insert(new Q.RotatingBackground());
    leftContainer = stage.insert(new Q.UI.Container({
      x: Q.width * 0.04,
      y: Q.height * 0.25,
      fill: 'rgba(12,12,12,0.7)'
    }));
    leftContainer.insert(new Q.UI.Text({
      x: 140,
      y: 20,
      label: "Course\nCollision",
      color: 'White',
      size: 40,
      align: 'center'
    }));
    playLocalButton = leftContainer.insert(new Q.UI.Button({
      x: 140,
      y: 220,
      fill: 'white',
      label: 'Local Game'
    }));
    playLocalButton.on('click', function() {
      Q.clearStages();
      return Q.stageScene('playing');
    });
    playAiButton = leftContainer.insert(new Q.UI.Button({
      x: 140,
      y: 300,
      fill: 'white',
      label: 'AI Game'
    }));
    playAiButton.on('click', function() {
      Q.clearStages();
      Q.state.set('ai', true);
      return Q.stageScene('playing');
    });
    leftContainer.fit(400, 60);
    rightContainer = stage.insert(new Q.UI.Container({
      x: Q.width * 0.47,
      y: Q.height * 0.25,
      fill: 'rgba(250,196,98,0.95)'
    }));
    rightContainer.insert(new Q.UI.Text({
      x: 10,
      y: 10,
      color: 'black',
      align: 'left',
      size: 16
    }, {
      label: "Your sun is rapidly expanding and your\ncivilizations' only recourse is to attempt to\nsettle off world. With solar flares tampering\nwith all forms of guidance software, your \ncivilization launches rockets bearing supplies, \nsettlers,and high grade nuclear fuel to your new \nhomes. Unfortunately your pesky neighbor is \nthinking the exact same. Looks like your \non track for a course collision?! \n  \nPlayer 1 (Blue): \n Launch supply ship:  Z\n Launch settler ship:  X \n Launch nuclear fuel ship: C\n   \nPlayer 2 / AI (Red):\n Launch supply ship:  Left\n Launch settler ship:  Down \n Launch nuclear fuel ship: Right"
    }));
    leftContainer.insert(new Q.UI.Text({
      x: 140,
      y: 500,
      color: 'white',
      size: 13,
      align: 'center',
      label: "Made by Roy Zhang \nand Vincent Pizzo \nwith music by Will Reynolds\nfor Ludum Dare 30"
    }));
    return rightContainer.fit(300, 30);
  });

  Q.scene('roundOver', function(stage) {
    var bluesLeft, container, continueButton, intervalId, mainMenuButton, redsLeft;
    intervalId = setInterval(function() {
      var ai, backgroundAngle, blueCash, blueOnLeft, bluePlanet, blueStation, bluesLeft, isFifths, isHalves, redCash, redPlanet, redStation, redsLeft, sun;
      Q.state.inc('timefourths', 1);
      isFifths = Q.state.get('timefourths') % 5 === 0;
      isHalves = Q.state.get('timefourths') % 2 === 0;
      blueStation = Q('BlueStation').first().p;
      redStation = Q('RedStation').first().p;
      bluePlanet = Q('BluePlanet').first().p;
      redPlanet = Q('RedPlanet').first().p;
      if (isFifths && redPlanet.y > Q.width * 0.5) {
        Q.stage().insert(new Q.PlanetExplosionAnimation({
          x: bluePlanet.x - 50 + Math.random() * 90,
          y: bluePlanet.y - 20 + Math.random() * 80
        }));
        Q.stage().insert(new Q.PlanetExplosionAnimation({
          x: redPlanet.x - 50 + Math.random() * 90,
          y: redPlanet.y - 20 + Math.random() * 80
        }));
      }
      if (isHalves && redPlanet.y > Q.width * 0.5) {
        redPlanet.vx = 10;
        bluePlanet.vx = -10;
      } else {
        Q('RedPlanet').first().p.vx = -10;
        Q('BluePlanet').first().p.vx = 10;
      }
      if (redPlanet.y < Q.width * 0.5) {
        redPlanet.vx = 0;
        bluePlanet.vx = 0;
      }
      if (Q.state.get('needTransition')) {
        sun = Q('Sun').first().p;
        Q.state.set('rotateSpeed', 0.4);
        blueStation.vy = 200;
        redStation.vy = 200;
        bluePlanet.vy = 200;
        redPlanet.vy = 200;
        sun.vy = 200;
        if (sun.y > Q.height * 0.75) {
          sun.vy = 0;
          if (Q.state.get('blueOnLeft')) {
            bluePlanet.x = Q.width * 0.15;
            redPlanet.x = Q.width * 0.85;
          } else {
            bluePlanet.x = Q.width * 0.85;
            redPlanet.x = Q.width * 0.15;
          }
          if (bluePlanet.y > Q.height * 0.5) {
            bluePlanet.y = -270;
            redPlanet.y = -270;
          }
        }
        if (blueStation.y >= Q.height * 0.785) {
          blueStation.vy = 0;
          redStation.vy = 0;
          bluePlanet.vy = 0;
          redPlanet.vy = 0;
          Q.state.set('needTransition', false);
          redsLeft = Q.state.get('redFinalSettlers');
          bluesLeft = Q.state.get('blueFinalSettlers');
          redCash = Q.state.get('redFinalCash');
          blueCash = Q.state.get('blueFinalCash');
          ai = Q.state.get('ai');
          blueOnLeft = Q.state.get('blueOnLeft');
          backgroundAngle = Q('RotatingBackground').first().p.angle;
          Q.clearStages();
          resetState();
          Q.state.set('ai', ai);
          if (redsLeft % 2 === 1) {
            redsLeft += 1;
          }
          if (bluesLeft % 2 === 1) {
            bluesLeft += 1;
          }
          Q.state.set('redInitialSettlers', redsLeft + redsLeft / 2);
          Q.state.set('blueInitialSettlers', bluesLeft + bluesLeft / 2);
          Q.state.set('redInitialCash', redCash + 50);
          Q.state.set('blueInitialCash', blueCash + 50);
          Q.state.set('backgroundAngle', backgroundAngle);
          Q.state.set('blueOnLeft', !blueOnLeft);
          clearInterval(intervalId);
          return Q.stageScene('playing');
        }
      }
    }, 100);
    container = stage.insert(new Q.UI.Container({
      x: Q.width / 2,
      y: Q.height * 0.43,
      fill: 'rgba(0,0,0,0.5)'
    }));
    redsLeft = Q.state.get('redFinalSettlers');
    bluesLeft = Q.state.get('blueFinalSettlers');
    if (redsLeft === 0 || bluesLeft === 0) {
      if (redsLeft === 0 && bluesLeft === 0) {
        container.insert(new Q.UI.Text({
          x: 0,
          y: 0,
          label: 'Both sides have been eliminated',
          color: 'white',
          align: 'center'
        }));
      } else if (redsLeft === 0) {
        container.insert(new Q.UI.Text({
          x: 0,
          y: 0,
          label: 'Red has been destroyed. Blue survives.',
          color: 'blue',
          align: 'center'
        }));
      } else if (bluesLeft === 0) {
        container.insert(new Q.UI.Text({
          x: 0,
          y: 0,
          label: 'Blue has been destroyed. Red survives.',
          color: 'red',
          align: 'center'
        }));
      }
    } else {
      continueButton = container.insert(new Q.UI.Button({
        x: 0,
        y: 0,
        fill: 'white',
        label: 'The exodus continues'
      }));
      continueButton.on('click', function() {
        return Q.state.set('needTransition', true);
      });
    }
    mainMenuButton = container.insert(new Q.UI.Button({
      x: 0,
      y: 70,
      fill: 'white',
      label: 'Main Menu'
    }));
    mainMenuButton.on('click', function() {
      Q.clearStages();
      resetState();
      clearInterval(intervalId);
      return Q.stageScene('mainMenu');
    });
    return container.fit(30, 1000);
  });

  Q.scene('playing', function(stage) {
    var blueFinalStatsContainer, blueStatsContainer, intervalId, redFinalStatsContainer, redStatsContainer;
    stage.insert(new Q.RotatingBackground());
    stage.insert(new Q.BlueStation());
    stage.insert(new Q.RedStation());
    stage.insert(new Q.BluePlanet());
    stage.insert(new Q.RedPlanet());
    stage.insert(new Q.Sun());
    stage.insert(new Q.PrepTimer());
    if (Q.state.get('blueOnLeft')) {
      blueStatsContainer = stage.insert(new Q.UI.Container({
        fill: 'rgba(70, 169, 240, 0.8)',
        y: Q.height * 0.65,
        x: Q.width * 0.05
      }));
      stage.insert(new Q.BlueStats(), blueStatsContainer);
      blueStatsContainer.fit(10, 10);
      redStatsContainer = stage.insert(new Q.UI.Container({
        fill: 'rgba(184, 39, 72, 0.8)',
        y: Q.height * 0.65,
        x: Q.width * 0.85
      }));
      stage.insert(new Q.RedStats(), redStatsContainer);
      redStatsContainer.fit(10, 10);
      blueFinalStatsContainer = stage.insert(new Q.UI.Container({
        fill: 'rgba(70, 169, 240, 0.8)',
        y: Q.height * 0.25,
        x: Q.width * 0.85
      }));
      stage.insert(new Q.BlueFinalStats(), blueFinalStatsContainer);
      blueFinalStatsContainer.fit(10, 10);
      redFinalStatsContainer = stage.insert(new Q.UI.Container({
        fill: 'rgba(184, 39, 72, 0.8)',
        y: Q.height * 0.25,
        x: Q.width * 0.05
      }));
      stage.insert(new Q.RedFinalStats(), redFinalStatsContainer);
      redFinalStatsContainer.fit(10, 10);
    } else {
      blueStatsContainer = stage.insert(new Q.UI.Container({
        fill: 'rgba(70, 169, 240, 0.8)',
        y: Q.height * 0.65,
        x: Q.width * 0.85
      }));
      stage.insert(new Q.BlueStats(), blueStatsContainer);
      blueStatsContainer.fit(10, 10);
      redStatsContainer = stage.insert(new Q.UI.Container({
        fill: 'rgba(184, 39, 72, 0.8)',
        y: Q.height * 0.65,
        x: Q.width * 0.05
      }));
      stage.insert(new Q.RedStats(), redStatsContainer);
      redStatsContainer.fit(10, 10);
      blueFinalStatsContainer = stage.insert(new Q.UI.Container({
        fill: 'rgba(70, 169, 240, 0.8)',
        y: Q.height * 0.25,
        x: Q.width * 0.05
      }));
      stage.insert(new Q.BlueFinalStats(), blueFinalStatsContainer);
      blueFinalStatsContainer.fit(10, 10);
      redFinalStatsContainer = stage.insert(new Q.UI.Container({
        fill: 'rgba(184, 39, 72, 0.8)',
        y: Q.height * 0.25,
        x: Q.width * 0.85
      }));
      stage.insert(new Q.RedFinalStats(), redFinalStatsContainer);
      redFinalStatsContainer.fit(10, 10);
    }
    return intervalId = setInterval(function() {
      var aiStrat, isFourth, picker;
      Q.state.inc('timefourths', 1);
      isFourth = Q.state.get('timefourths') % 4 === 0;
      if (Q.state.get('prepTimer') > 0) {
        if (isFourth) {
          Q.state.dec('prepTimer', 1);
        }
        if (Q.state.get('prepTimer') <= 0) {
          stage.insert(new Q.Timer());
          return Q.state.set('mode', 'Playing');
        }
      } else {
        if (Q.state.get('timer') > 1) {
          if (Q.state.get('ai') === true) {
            aiStrat = Q.state.get('aiStrat');
            if (aiStrat === 'blockade') {
              Q.input.trigger('launchRedSupply');
            } else if (aiStrat === 'rush') {
              Q.input.trigger('launchRedSupply');
              Q.input.trigger('launchRedSettler');
              if (isFourth) {
                Q.input.trigger('launchRedNuke');
              }
            } else if (aiStrat === 'hunt') {
              if (isFourth) {
                if (Q('BlueShip').length <= 1) {
                  Q.input.trigger('launchRedSupply');
                  Q.input.trigger('launchRedSettler');
                }
                if (Q('BlueShip').length > 5) {
                  Q.input.trigger('launchRedNuke');
                }
              }
            }
            if (Math.random() < 0.07) {
              picker = Math.random();
              if (picker > 0.8) {
                Q.state.set('aiStrat', 'rush');
              } else if (picker > 0.5) {
                Q.state.set('aiStrat', 'blockade');
              } else {
                Q.state.set('aiStrat', 'hunt');
              }
            }
            if (Q.state.get('timer') < 6) {
              Q.state.set('aiStrat', 'rush');
            }
          }
          if (Q.state.get('blueInitialCash') === 0 && Q.state.get('redInitialCash') === 0 && Q.state.get('blueInitialSettlers') === 0 && Q.state.get('redInitialSettlers') === 0) {
            monitorForRoundEnd();
            Q.state.set('mode', 'RoundEnd');
            if (isFourth) {
              Q.state.dec('timer', 1);
            }
            return clearInterval(intervalId);
          } else {
            if (isFourth) {
              return Q.state.dec('timer', 1);
            }
          }
        } else if (Q.state.get('timer') <= 1) {
          monitorForRoundEnd();
          Q.state.set('mode', 'RoundEnd');
          Q.state.dec('timer', 1);
          return clearInterval(intervalId);
        }
      }
    }, 250);
  });

  assets = ['level1.png', 'planetb1.png', 'planetb2.png', 'planetr1.png', 'planetr2.png', 'sun.png', 'blueRocket.png', 'redRocket.png', 'explode.png', 'explode.json', 'explosion.mp3', 'shoot.mp3', 'shoot2.mp3', 'blueSettlers.png', 'blueSettlers.json', 'redSettlers.png', 'redSettlers.json', 'redNuke.png', 'blueNuke.png', 'nukeExplode.png', 'nukeExplode.json', 'background.mp3', 'nuke.mp3'];

  Q.load(assets.join(', '), function() {
    Q.compileSheets('explode.png', 'explode.json');
    Q.compileSheets('nukeExplode.png', 'nukeExplode.json');
    Q.compileSheets('blueSettlers.png', 'blueSettlers.json');
    Q.compileSheets('redSettlers.png', 'redSettlers.json');
    Q.audio.play('background.mp3', {
      loop: true
    });
    Q.animations('explode', {
      explode: {
        frames: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        rate: 1 / 6,
        loop: false
      }
    });
    Q.animations('nukeExplode', {
      nukeExplode: {
        frames: [1, 4, 5, 6, 7, 3, 2, 12],
        rate: 1 / 10,
        loop: false
      },
      planetExplode: {
        frames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        rate: 1 / 6,
        loop: false
      }
    });
    Q.animations('blueSettlers', {
      blueSettlers: {
        frames: [4, 5, 6, 7],
        rate: 1 / 8,
        loop: true
      }
    });
    Q.animations('redSettlers', {
      redSettlers: {
        frames: [4, 5, 6, 7],
        rate: 1 / 8,
        loop: true
      }
    });
    return Q.stageScene('mainMenu');
  });

}).call(this);
