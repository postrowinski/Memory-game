$(document).ready(function () {
    let canClick = true;
    let createNewTry = false;
    let computerColorPick;

    const $gameContainer = $('.game').find('.container');
    const $counter = $('.counter');
    const $pickColorContainer = $('.pick-color-container');

    //Object which create new row
    function Try () {
        const row = document.createElement('div');
        row.classList.add('row');
        row.innerHTML = `
            <div class="col-xs-8 text-center color-place-container">
                <div class="color-place active" data-color></div>
                <div class="color-place active" data-color></div>
                <div class="color-place active" data-color></div>
                <div class="color-place active" data-color></div>
                <button class="btn btn-success btn-accept pull-right">Zatwierdź</button>
             </div>
             <div class="col-xs-4 answers-container"></div>
        `;
        return row;
    }

    //Object Compare
    // - Which have 4 arguments for each to every color place
    // - Then compare this arguments with computer random pick array
    // - if color it's on right place computer create div fill with black color
    // - if color it's on right place but is it on pool computer create div fill with white color
    // - if color it isn't on pool computer doesn't create anything
    function Compare (place1, place2, place3, place4) {
        //let self = this;
        this.answerSort = [];
        this.place1 = place1;
        this.place2 = place2;
        this.place3 = place3;
        this.place4 = place4;

        this.answer1;
        this.answer2;
        this.answer3;
        this.answer4;

        console.log(computerColorPick);

        if (this.place1 === computerColorPick[0]) {
            this.answerSort.push('black');
        } else if (this.place1 === computerColorPick[1] || this.place1 === computerColorPick[2] || this.place1 === computerColorPick[3]) {
            this.answerSort.push('white');
        } else {
            this.answerSort.push('');
        }

        if (this.place2 === computerColorPick[1]) {
            this.answerSort.push('black');
        } else if (
            ((this.place2 === computerColorPick[0]) && (this.answerSort[0] !== 'black')) ||
            ((this.place2 === computerColorPick[2]) && (this.answerSort[0] !== 'black')) ||
            ((this.place2 === computerColorPick[3]) && (this.answerSort[0] !== 'black'))
        ) {
            this.answerSort.push('white');
        } else {
            this.answerSort.push('');
        }

        if (this.place3 === computerColorPick[2]) {
            this.answerSort.push('black');
        } else if (
            ((this.place3 === computerColorPick[0]) && (this.answerSort[0] !== 'black') && (this.answerSort[1] !== 'black')) ||
            ((this.place3 === computerColorPick[2]) && (this.answerSort[0] !== 'black') && (this.answerSort[1] !== 'black')) ||
            ((this.place3 === computerColorPick[3]) && (this.answerSort[0] !== 'black') && (this.answerSort[1] !== 'black'))
        ) {
            this.answerSort.push('white');
        } else {
            this.answerSort.push('');
        }

        if (this.place4 === computerColorPick[3]) {
            this.answerSort.push('black');
        } else if (
            ((this.place4 === computerColorPick[0]) && (this.answerSort[0] !== 'black') && (this.answerSort[1] !== 'black') && (this.answerSort[2] !== 'black')) ||
            ((this.place4 === computerColorPick[2]) && (this.answerSort[0] !== 'black') && (this.answerSort[1] !== 'black') && (this.answerSort[2] !== 'black')) ||
            ((this.place4 === computerColorPick[3]) && (this.answerSort[0] !== 'black') && (this.answerSort[1] !== 'black') && (this.answerSort[2] !== 'black'))
        ) {
            this.answerSort.push('white');
        } else {
            this.answerSort.push('');
        }

        //sort
        this.answerSort.sort(function (a, b) {
            if(a === "") return 1;
            if(b === "") return -1;
            if(a === b) return 0;
            return a < b ? -1 : 1;
        });

        this.answer1 = this.answerSort[0];
        this.answer2 = this.answerSort[1];
        this.answer3 = this.answerSort[2];
        this.answer4 = this.answerSort[3];
    }

    Compare.prototype.checkColor = function () {
        const answer = document.createElement('div');
        answer.classList.add('answer', 'text-center');
        answer.innerHTML = `
            <div class="answers ${this.answer1}"></div>
            <div class="answers ${this.answer2}"></div>
            <div class="answers ${this.answer3}"></div>
            <div class="answers ${this.answer4}"></div>
        `;

        return answer;
    };



    //Function which doesn't allow to click button 'Zatwierdź' until player don't set all color in row
    function checkClickConfirm() {
        const $colorPlaceLastRow = $('.game').find('.row').last().find('.color-place');

        if ($('.color-is-set').length === 4) {
            createNewTry = true;
        }

    }
    //Function which return new Array with no repeat and push
    // - create array with color pool
    // - create loop which splice one color and push this color to another array
    // - when loop is complete (in this case 4 time) function return array with colors which isn't repeat
    function randomColorNoRepeat () {
        computerColorPick = [];
        const colorPool = ['red', 'green', 'blue', 'yellow', 'black', 'gray'];
        for (let i = 4; i > 0; i--) {
            const random = Math.floor(Math.random() * colorPool.length);
            const pickColor = colorPool.splice(random, 1).toString();
            computerColorPick.push(pickColor);
        }
        return computerColorPick;
    }

    //Button New game:
    // - Remove all existing Try
    // - Randomize new color stuck
    // - Add first Try to Start new game
    // - Set turn do max 12
    $('.hero').on('click', '.btn-primary', function () {
        $gameContainer.children().remove();
        $gameContainer.append(Try());
        randomColorNoRepeat();
        placeColor();
        $counter.text('12');
        $('.turn-left').css('opacity', 1);
    });

    // Click button to accept turn 'Zatwierdź':
    // - Can be click when you pick all colors
    // - Click remove button from current Try
    // - Click add new Try and remove active for all prev
    // - Click decrease counter by 1 and if counter is less than 1 remove all Try and hide counter
    $('.game').on('click','.btn-accept', function () {
        const nextTry = new Try();
        const $counterValue = +$counter.text();
        const $colorPlaceLastRow = $('.game').find('.row').last().find('.color-place');

        placeColor();
        checkClickConfirm();
            if (createNewTry) {
                const place1 = $colorPlaceLastRow.first().data('color');
                const place2 = $colorPlaceLastRow.first().next().data('color');
                const place3 = $colorPlaceLastRow.last().prev().data('color');
                const place4 = $colorPlaceLastRow.last().data('color');
                const compare = new Compare(place1, place2, place3, place4);

                $('.answers-container').last().append(compare.checkColor());

                $colorPlaceLastRow.removeClass('color-is-set');
                createNewTry = false;
                $gameContainer.append(nextTry);
                $(nextTry).css('display', 'none').fadeIn(600);
                $counter.text($counterValue - 1);
                placeColor();
                $(this).remove();
                $colorPlaceLastRow.removeClass('active');
            }

            if($counterValue < 2) {
                $gameContainer.children().remove();
                $('.turn-left').css('opacity', 0);
            }
    });

    // Place color
    // - Click get cords of clicked element x nad y
    // - set cords to picked-color-container
    // - Show picked-color-container below clicked element
    // - Add class current-place-color to know which one is currently active to place color
    function placeColor() {
        $('.color-place').click(function () {
            if ($(this).hasClass('active') && canClick) {
                const colorPlaceHeight = $('.color-place').clientHeight;
                const offsetTop = $(this)[0].offsetTop + $(this)[0].offsetParent.offsetTop + colorPlaceHeight;
                const offsetLeft = $(this)[0].offsetLeft + $(this)[0].offsetParent.offsetLeft;

                canClick = false;
                $(this).addClass('current-place-color');
                $pickColorContainer.css({'top': offsetTop, 'left': offsetLeft});
                $pickColorContainer.addClass('active').slideDown(400);
            }
        });
    }

    //Set Color
    // - Click get data-color from current clicked color
    // - Set to current-place-color class background color from creating const before getData
    // - Remove class current-place-color
    $('.picked-color').click(function () {
        const getData = $(this).data('color');

        $('.current-place-color').attr('data-color', getData);
        if ($('.current-place-color').attr('data-color') !== '') {
            $('.current-place-color').addClass('color-is-set')
        } else {
            $('.current-place-color').removeClass('color-is-set');
        }
        $('.color-place').removeClass('current-place-color');
        $pickColorContainer.removeClass('active').slideUp(400);
        canClick = true;
    });
});