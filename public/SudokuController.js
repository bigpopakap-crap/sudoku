/*
    This is the controller. It connets the model to the UI

    $ - pointer to JQuery
    $board - JQuery object pointing at the root div that contains the sudoku board
    rawBoard - the board data generated by the server
    $input - JQuery object pointing at the input panel
*/
function SudokuController($, $board, rawBoard, $input) {

    /* TODO make good global constant object that's shared between client and server */
    var SQUARE_SIZE = 3;
    var NUM_SQUARES = 3;
    var BOARD_SIZE = SQUARE_SIZE * NUM_SQUARES;

    var model;

    function _to2dArray(arr, splitSize) {
        var array2d = [];
        while (arr.length) {
            array2d.push(arr.splice(0, splitSize));
        }
        return array2d;
    }

    /** Helper that gets the JQuery object pointing at the requested square */
    function _getSquare(row, col) {
        var square = $board.find('[data-sudo-row="' + row + '"][data-sudo-col="' + col + '"]');
        if (!square.length) {
            throw 'Could not locate square ' + row + ', ' + col;
        }
        return square;
    }

    /** Getter for the model to help with debugging */
    function getModel() {
        return model;
    }

    function start() {
        //set up the model, and subscribe to value change notifications
        model = new SudokuModel(_to2dArray(rawBoard, BOARD_SIZE), function(row, col, val) {
            //on change, update the view. 0's convert to empty string
            _getSquare(row, col).text(val || '');
        });

        //set up listeners for when the value changes in the UI
        var squares = $board.find('.square');
        squares.change(function(e) {
            var square = $(e.target);
            var row = parseInt(square.attr('data-sudo-row'));
            var col = parseInt(square.attr('data-sudo-col'));
            return model.setVal(row, col, square.text());
        });

        squares.keypress(function(e) {
            var square = $(e.target);
            square.text(String.fromCharCode(e.which));
            square.trigger('change');
        });

        //on focus in, change which cell is "selected"
        squares.focus(function(e) {
            //remove the class from whichever cell has it already
            squares.filter('.selected').removeClass('selected');

            var square = $(e.target);
            square.addClass('selected');
        });

        //set up input panel handlers
        $input.find('.input').click(function(e) {
            var input = $(e.target);
            var val = input.text();

            //find the selected cell, if any and put the value there
            var selected = squares.filter('.selected')
            selected.text(val);
            selected.trigger('change');
        });

        //set up handler for the clear button
        $input.find('.clear').click(function(e) {
            var selected = squares.filter('.selected');
            selected.text('');
            selected.trigger('change');
        });

        //set up handler for validate button
        $input.find('.validate').click(function(e) {

        });

        return this;
    }

    return {
        getModel: getModel,
        start: start
    }
}