$(document).ready(function () {
    let createNewTry = false;
    let computerColorPick;
    let youWin;

    const $instructionPosition = $('.instruction-position');
    const $gameContainer = $('.game').find('.container');
    const $counter = $('.counter');
    const $pickColorContainer = $('.pick-color-container');

    //Object which create new row
    function Try () {
        const row = document.createElement('div');
        row.classList.add('row');
        row.innerHTML = `
            <div class="col-xs-9 text-center color-place-container">
                <div class="color-flex-container">
                    <div class="color-place active" data-color></div>
                    <div class="color-place active" data-color></div>
                    <div class="color-place active" data-color></div>
                    <div class="color-place active" data-color></div>
                    <button class="btn btn-success btn-accept">Dalej</button>
                </div>
             </div>
             <div class="col-xs-3 answers-container"></div>
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
        this.copyComputerPick = computerColorPick;
        this.answerSort = [];

        this.place1 = place1;
        this.place2 = place2;
        this.place3 = place3;
        this.place4 = place4;

        const checkArr = [this.place1, this.place2, this.place3, this.place4];
        const indexOfBlack = [];
        const uniqueBlack = [];
        const indexOfWhite = [];
        const uniqueWhite = [];

        for (let i = 0; i < checkArr.length; i++) {
           if (checkArr[i] === this.copyComputerPick[i]) {
               this.answerSort.push('black');
               indexOfBlack.push(i);
               uniqueBlack.push(this.copyComputerPick[i]);
           }
        }

        indexOfBlack.reverse();

        for (let i = 0; i < indexOfBlack.length; i++) {
            checkArr.splice(indexOfBlack[i], 1);
        }

        for (let i = 0; i < checkArr.length; i++) {
            if (this.copyComputerPick.includes(checkArr[i])) {
                indexOfWhite.push(checkArr[i]);
            }
        }

        $.each(indexOfWhite, function(i, el){
            if($.inArray(el, uniqueWhite) === -1) uniqueWhite.push(el);
        });

        for (let i = 0; i < uniqueWhite.length; i++) {
            if (!(uniqueBlack.includes(uniqueWhite[i]))) {
                this.answerSort.push('white');
            }
        }

        console.log(computerColorPick);
        this.answer1 = this.answerSort[0];
        this.answer2 = this.answerSort[1];
        this.answer3 = this.answerSort[2];
        this.answer4 = this.answerSort[3];
    }

    Compare.prototype.checkColor = function () {
        const answer = document.createElement('div');
        answer.classList.add('answer');
        answer.innerHTML = `
            <div class="answers ${this.answer1}"></div>
            <div class="answers ${this.answer2}"></div>
            <div class="answers ${this.answer3}"></div>
            <div class="answers ${this.answer4}"></div>
        `;

        return answer;
    };

    //Object display when you win the game
    function CongratulationsYouWin () {
        const win = document.createElement('div');
        const turn = document.querySelector('.counter').innerText;
        win.classList.add('text-center', 'you-win');
        win.innerHTML = `
            <div>Wygrałeś w ${12 - turn} turze.</div>
            <div class='game-over-flex'>
                <div class='color-place' data-color='${computerColorPick[0]}'></div>
                <div class='color-place' data-color='${computerColorPick[1]}'></div>
                <div class='color-place' data-color='${computerColorPick[2]}'></div>
                <div class='color-place' data-color='${computerColorPick[3]}'></div>
            </div>
        `;

        return win;
    }

    //Object display when you lose the game
    function YouLose () {
        const lose = document.createElement('div');
        lose.classList.add('text-center', 'you-lose')
        lose.innerHTML = `
            <div class='text-center'>
                <div>Przegraleś prawidłowa odpowiedź to:</div>
                <div class='game-over-flex'>
                    <div class='color-place' data-color='${computerColorPick[0]}'></div>
                    <div class='color-place' data-color='${computerColorPick[1]}'></div>
                    <div class='color-place' data-color='${computerColorPick[2]}'></div>
                    <div class='color-place' data-color='${computerColorPick[3]}'></div>
                </div>
            </div>
        `;

        return lose;
    }


    function win () {
        $('.answer').last().find('.answers').each(function (index, element) {
            if ($(element).hasClass('black')) {
                youWin++;
            }
        });
    }

    function slideDown(top) {
        $('html, body').animate({
            scrollTop: top
        }, 300);
    }

    //Function which doesn't allow to click button 'Zatwierdź' until player don't set all color in row
    function checkClickConfirm() {
        if ($('.color-is-set').length === 4 && (!$('.pick-color-container').hasClass('active'))) {
            createNewTry = true;
        }
    }
    //Function which return new Array with no repeat and push
    // - create array with color pool
    // - create loop which splice one color and push this color to another array
    // - when loop is complete (in this case 4 time) function return array with colors which isn't repeat
    function randomColorNoRepeat () {
        computerColorPick = [];
        const colorPool = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
        for (let i = 4; i > 0; i--) {
            const random = Math.floor(Math.random() * colorPool.length);
            const pickColor = colorPool.splice(random, 1).toString();
            computerColorPick.push(pickColor);
        }
        return computerColorPick;
    }

    //Button New game 'Nowa Gra':
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
        $('.pick-color-container').css('display', 'none');
        $('.turn-left').css('opacity', 1);
    });

    // Click button to accept turn 'Dalej':
    // - Can be click when you pick all colors
    // - Click remove button from current Try
    // - Click add new Try and remove active for all prev
    // - Click decrease counter by 1 and if counter is less than 1 remove all Try and hide counter
    $('.game').on('click','.btn-accept', function () {
        const nextTry = new Try();
        const $counterValue = +$counter.text();
        const $colorPlaceLastRow = $('.game').find('.row').last().find('.color-place');
        const $slideDown = $(this).offset().top;

        pickColor();
        placeColor();
        checkClickConfirm();
        if (createNewTry) {
            youWin = 0;
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
            win();
            if (youWin === 4) {
                $gameContainer.children().remove();
                $('.turn-left').css('opacity', 0);
                const youWin = new CongratulationsYouWin();
                $($gameContainer).append(youWin);
            }
        }

        if ($counterValue < 2) {
            const lose = new YouLose();
            $gameContainer.children().remove();
            $('.turn-left').css('opacity', 0);
            $gameContainer.append(lose);
        }

        slideDown($slideDown);
    });

    // Place color
    // - Click get cords of clicked element x nad y
    // - set cords to picked-color-container
    // - Show picked-color-container below clicked element
    // - Add class current-place-color to know which one is currently active to place color
    function placeColor() {
        $('.color-place').click(function () {
            if ($(this).hasClass('active')) {
                const $singleColorPlace = $('.color-place.active').first();
                const colorPlaceClientHeight = $singleColorPlace.css('height').replace('px' , '');
                const colorPlaceClientMargin = $singleColorPlace.css('margin-right').replace('px' , '');
                const colorPlaceRealHeight = +colorPlaceClientHeight + +colorPlaceClientMargin;

                const offsetTop = $(this)[0].offsetTop + $(this)[0].offsetParent.offsetTop + colorPlaceRealHeight;
                const offsetLeft = $(this)[0].offsetLeft + $(this)[0].offsetParent.offsetLeft;
                $('.color-place').removeClass('current-place-color');
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
    function pickColor () {
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
        });
    }
    pickColor();

    //Instructions
    // - Toggle hide and show after click button 'instrukcja'
    $('.hero').on('click', '.btn-warning', function () {
        const absoluteLeft = $instructionPosition.offset().left;
        const absoluteTop = $instructionPosition[0].clientHeight;

        $('.instruction').css({'top': absoluteTop, 'left': absoluteLeft, 'min-height': `calc(100vh - ${absoluteTop}px - 15px)`});
        $('.instruction').fadeToggle(300);
    });
});