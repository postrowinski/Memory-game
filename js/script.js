$(document).ready(function () {
    let canClick = true;
    let createNewTry = false;

    const $gameContainer = $('.game').find('.container');
    const $counter = $('.counter');
    const $pickColorContainer = $('.pick-color-container');

    function Try () {
        const row = document.createElement('div');
        row.classList.add('row');
        row.innerHTML = `
            <div class="col-xs-8 text-center color-place-container">
                <div class="color-place active"></div>
                <div class="color-place active"></div>
                <div class="color-place active"></div>
                <div class="color-place active"></div>
                <button class="btn btn-success btn-accept pull-right">Zatwierdź</button>
             </div>
             <div class="col-xs-4"></div>
        `;

        return row;
    }

    function checkClickConfirm() {
        const $colorPlaceLastRow = $('.game').find('.row').last().find('.color-place');

            if ($colorPlaceLastRow.css('background-color') !== 'rgb(255, 255, 255)') {
                return createNewTry = true;
            } else {
                return createNewTry = false;
            }

    }

    //Button New game remove:
    // - Remove all existing Try
    // - Add first Try to Start new game
    // - Set turn do max 12
    $('.hero').on('click', '.btn-primary', function () {
        $gameContainer.children().remove();
        $gameContainer.append(Try());
        placeColor();
        $counter.text('12');
        $('.turn-left').css('opacity', 1);
    });

    // Click button to accept turn:
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
    //- Click get cords of clicked element x nad y
    //- set cords to picked-color-container
    //- Show picked-color-container below clicked element
    //- Add class current-place-color to know which one is currently active to place color
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
    //- Click get data-color from current clicked color
    //- Set to current-place-color class background color from creating const before getData
    //- Remove class current-place-color
    $('.picked-color').click(function () {
        const getData = $(this).data('color');

        $('.current-place-color').css('background', getData);
        $('.color-place').removeClass('current-place-color');
        $pickColorContainer.removeClass('active').slideUp(400);
        canClick = true;
    });
});