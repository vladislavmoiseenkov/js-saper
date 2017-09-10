var Game = {
    countBombs: 10,
    sizeX: 10,
    sizeY: 10,
    area: [],
    isInitBombs: false,

    createArea: function () {
        var container = document.getElementById('container');

        for( var i = 0; i < this.sizeX; i++ ) {
            this.area[i] = [];
            var flexContainer = document.createElement('div');
            flexContainer.className = 'flex-container';
            for( var j = 0; j < this.sizeY; j++ ) {
                this.area[i][j] = {
                    isOpen: false,
                    isBomb: false,
                    isFlag: false,
                    isQuestion: false
                };

                var flexElement = document.createElement('div');
                flexElement.className = 'flex-element';
                flexElement.setAttribute('data-row', i);
                flexElement.setAttribute('data-col', j);
                flexContainer.appendChild( flexElement );
            }
            container.appendChild( flexContainer );
        }
    },

    generateBombs: function () {
        var x, y, count = 0;
        for( var i = 0; i < this.countBombs; i++ ) {
            x = parseInt( Math.random() * this.countBombs );
            y = parseInt( Math.random() * this.countBombs );

            if( this.area[x][y].isBomb === true || this.area[x][y].isOpen === true ) {
                i--;
            } else {
                this.area[x][y].isBomb = true;
                count++;
            }
        }
        console.log(count, this.area);
    },

    showBombs: function() {
        var count = 0;

        for( var i = 0; i < this.sizeX; i++ ) {
            for( var j = 0; j < this.sizeY; j++ ) {
                if( this.area[i][j].isBomb === true ) {
                    var bomb = document.createElement('img');
                    bomb.setAttribute('src', 'img/bomb.png');
                    bomb.className = 'flags-img';
                    document.getElementsByClassName('flex-element')[count].appendChild(bomb);
                }
                count++;
            }
        }
    },

    openCell: function (x, y) {
        var count = 0,
            self = this;

        if( this.area[x][y].isBomb ) {
            alert('Game over!');
            this.showBombs();
            setTimeout(function () {
                self.clearArea();
                Game.start();
            }, 2000);
            return;
        }

        if( this.area[x][y].isFlag || this.area[x][y].isQuestion ) {
            return;
        }

        this.area[x][y].isOpen = true;

        if( this.isInitBombs === false ) {
            this.generateBombs();
            this.isInitBombs = true;
        }


        for( var i = +x - 1; i < +x + 2; i++ ) {
            for( var j = +y - 1; j < +y + 2; j++ ) {
                if( i < 0 || i > this.sizeX - 1 || j < 0 || j > this.sizeY - 1 || ( x === i && y === j ) ) {
                    continue;
                }
                if( this.area[i][j].isBomb === true ) {
                    count++;
                }
            }
        }

        var cell = x.toString() + y.toString();
        document.getElementsByClassName('flex-element')[+cell].setAttribute('class', document.getElementsByClassName('flex-element')[+cell].getAttribute('class') + ' open');
        document.getElementsByClassName('flex-element')[+cell].innerText = count;

        if( count === 0 ) {
            for( var i = +x - 1; i < +x + 2; i++ ) {
                for( var j = +y - 1; j < +y + 2; j++ ) {
                    if( i < 0 || i > this.sizeX - 1 || j < 0 || j > this.sizeY - 1 || ( x === i && y === j ) ) {
                        continue;
                    }

                    if ( !this.area[i][j].isOpen ) {
                        this.openCell(i, j);
                    }
                }
            }
        }
    },

    setFlag: function (x, y) {
        var cell = x.toString() + y.toString(),
            flag = document.createElement('img');

        flag.setAttribute('src', 'img/flag.png');
        flag.className = 'flags-img';

        this.area[x][y].isFlag = !this.area[x][y].isFlag;
        document.getElementsByClassName('flex-element')[+cell].appendChild(flag);
    },

    setQuestion: function (x, y) {
        var cell = x.toString() + y.toString(),
            flag = document.createElement('img');

        flag.setAttribute('src', 'img/question.png');
        flag.className = 'flags-img';

        this.area[x][y].isFlag = !this.area[x][y].isFlag;
        this.area[x][y].isQuestion = !this.area[x][y].isQuestion;

        document.getElementsByClassName('flex-element')[+cell].removeChild(document.getElementsByClassName('flex-element')[+cell].childNodes[0]);
        document.getElementsByClassName('flex-element')[+cell].appendChild(flag);
    },

    setFree: function (x, y) {
        var cell = x.toString() + y.toString();

        this.area[x][y].isQuestion = !this.area[x][y].isQuestion;
        document.getElementsByClassName('flex-element')[+cell].removeChild(document.getElementsByClassName('flex-element')[+cell].childNodes[0]);
    },

    checkWin: function () {
        var count = 0,
            self = this;
        for( var i = 0; i < this.sizeX; i++ ) {
            for( var j = 0; j < this.sizeY; j++ ) {
                if( this.area[i][j].isBomb && this.area[i][j].isFlag ) {
                    count++;
                } else if( !this.area[i][j].isBomb && this.area[i][j].isOpen ) {
                    count++;
                }
            }
        }

        if( count === this.sizeX * this.sizeY ) {
            alert('Congratulations');
            setTimeout(function () {
                self.clearArea();
                self.start();

            }, 2000);
        }
    },

    clearArea: function () {
        for( var i = this.sizeX; i > -1; i--  ) {
            document.getElementById('container').removeChild(document.getElementById('container').childNodes[i]);
        }
    },

    delegateEvents: function() {
        var self = this;
        for( var i = 0; i < ( this.sizeX * this.sizeY ); i++ ) {
            document.getElementsByClassName('flex-element')[i].addEventListener('click', function() {
                var x = this.getAttribute('data-row'),
                    y = this.getAttribute('data-col');
                self.openCell(x, y);
                self.checkWin();
            });
        }

        for( var i = 0; i < this.sizeX * this.sizeY; i++ ) {
            document.getElementsByClassName('flex-element')[i].addEventListener('contextmenu', function (e) {
                e.preventDefault();
                var x = this.getAttribute('data-row'),
                    y = this.getAttribute('data-col');

                if( !self.area[x][y].isOpen && !self.area[x][y].isFlag && !self.area[x][y].isQuestion ) {
                    self.setFlag(x, y);
                } else if( !self.area[x][y].isOpen && self.area[x][y].isFlag ) {
                    self.setQuestion(x, y);
                } else if( !self.area[x][y].isOpen && self.area[x][y].isQuestion ) {
                    self.setFree(x, y);
                }
                self.checkWin();
            });

        }
    },

    start: function () {
        this.createArea();
        this.delegateEvents();
    }
};

Game.start();