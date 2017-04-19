(function ($) {    var cmd = new Cmd();    (function() {        chrome.windows.getCurrent({}, function (activeWindow) {            var width = 800;            var htmlSelector = $('html');            if (activeWindow.width < 800) {                width = activeWindow.width;            }            htmlSelector.width(width);            if (activeWindow.height < 600) {                htmlSelector.height(activeWindow.height);            }        });    })();    $(document).ready(function () {        var form = $('#command');        var commandInput = $('#commandInput');        commandInput.focus();        var historyIndex = -1;        var cachedCommand = '';        commandInput.on('keydown', function(event){            // history navigate            if(event.key === "ArrowUp" || event.key === "ArrowDown"){                if(historyIndex === -1){                    cachedCommand = $(form[0].elements.commandInput).val();                }                if(event.key === "ArrowUp"){                    if(cmd.history.hasIndex(historyIndex + 1)){                        ++historyIndex;                        $(form[0].elements.commandInput).val(cmd.history.get(historyIndex));                    }                } else {                    if((historyIndex -1) < 0){                        $(form[0].elements.commandInput).val(cachedCommand);                        historyIndex = -1;                    } else if(cmd.history.hasIndex(historyIndex - 1)) {                        --historyIndex;                        $(form[0].elements.commandInput).val(cmd.history.get(historyIndex));                    }                }                event.preventDefault();                return;            }            if(event.key === "Tab"){                console.log('automplete');                event.preventDefault();            }        });        form.on('submit', function (){            historyIndex = -1;            onSubmitCommund(this);            return false;        });    });    function onSubmitCommund(form) {        // создать команду        var command = new Command($(form.elements.commandInput).val());        // очистить ввод        $(form.elements.commandInput).val('');        // добавить в историю        cmd.history.add(command);        // // выполнить.        // try {        //     cmd.output.print('<span class="command-result">' + cmd.run(command) + '</span>');        // } catch(e) {        //     cmd.output.printError(e.message);        // }    }    function Command(inputCommand) {        var line = inputCommand,            params = line.split(' '),            commandName = params.splice(0, 1)[0];        if (!(this instanceof Command)) {            return new Command(inputCommand);        }        this.getLine = function () {            return line;        };        this.getCommandName = function(){            return commandName;        };        this.getParams = function (){            return params;        };    }    function Cmd() {        if (!(this instanceof Cmd)) {            return new Cmd();        }        this.run = function (command) {            if(command.getCommandName() === undefined){                return '';            }            if(commands[command.getCommandName()] === undefined){                throw Error('command not find');            }            return commands[command.getCommandName()](command.getParams());        }    }    function History()    {        if (!(this instanceof History)) {            return new History();        }        var log = [];        /**         * Добавляет команду в начало истории и обрезает историю         * @param command         */        this.add = function(command)        {            log.unshift(command.getLine());            console.log(log);            cmd.output.print('<span>>&nbsp;</span>' +command.getLine());        };        /**         * Возвращает команду, которая вызывалась index шагов назад         * @param index         */        this.get = function (index)        {            if(this.hasIndex(index)){                return log[index];            } else {                return undefined;            }        };        this.hasIndex = function(index)        {            return log[index];        }    }    function Output() {        if (!(this instanceof Output)) {            return new Output();        }    }    Output.prototype.print = function (text)    {        $('#hint').append($('<p class="output">' + text + '</p>'));    };    Output.prototype.printError = function (error)    {        $('#hint').append($('<p class="output error">' + error + '</p>'));    };    Cmd.prototype.history = new History();    Cmd.prototype.output = new Output();    var commands = {        reload: function(){            /* reload page */            return 'run reload page';        },        url: function(){            /* open url*/            return 'open url';        },        help: function(){            /* show help page */            return 'show help page';        }    };    /*    работа с вкладками    // перезагружает вкладку    tab gmail reload    // сохраняет текущую вкладку как gmail для последующего доступа    tab . save gmail    // ткрывает в новой вкладке сайт google.com    tab + google.com     работа с урлами     url open https://gmail.com     */})(jQuery);