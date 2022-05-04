$(document).ready(function () {
    $('#recipeForm').submit(function (event) {
        event.preventDefault();

        let title = $('#title').val();
        let poster = $('#username').attr('val');
        let img = $('#image').val();
        let description = $('#descrption').val();

        let steps = '';
        $('input[name=step]').each(function (index) {
            steps += `${index + 1}. ${$(this).val()}\n`;
        });

        let ingredientArray = [];
        $('input[name=ingredient]').each(function () {
            let ingredient = { food: $(this).val() };
            ingredientArray.push(ingredient);
        });
        $('input[name=quantity]').each(function (index) {
            ingredientArray[index].quantity = parseInt($(this).val());
        });
        $('input[name=units]').each(function (index) {
            ingredientArray[index].units = $(this).val();
        });

        const newRecipe = {
            title: title,
            img: img,
            poster: poster,
            description: description,
            directions: steps,
            ingredients: ingredientArray,
        };

        console.log(newRecipe);

        var formSubmitConfig = {
            method: 'POST',
            url: `/recipes/`,
            contentType: 'application/json',
            data: JSON.stringify(newRecipe),
            //This should never get called means server has errored/input validation in client side insufficient
            error: function (request) {
                alert('Adding a recipe failed make sure to include steps and ingredients');
                console.log(request.responseText);
            },
        };

        $.ajax(formSubmitConfig).then(function (responseMessage) {
            console.log(responseMessage);
            $('#recipeForm').trigger('reset');
        });
    });

    $('#addStep').click(function () {
        var html = '';
        html += '<div id="inputFormRow">';
        html += '<div class="input-group mb-3">';
        html +=
            '<input type="text" name="step" class="form-control m-input" placeholder="Enter step" autocomplete="off">';
        html += '<div class="input-group-append">';
        html += '<button id="removeRow" type="button" class="btn btn-danger">Remove</button>';
        html += '</div>';
        html += '</div>';

        $('#stepRows').append(html);
        $(document).on('click', '#removeRow', function () {
            $(this).closest('#inputFormRow').remove();
        });
    });

    $('#addIngredient').click(function () {
        var html = '';
        html += '<div id="inputFormRow">';
        html += '<div class="input-group mb-3">';
        html +=
            '<input type="text" name="ingredient" class="form-control m-input" placeholder="Enter ingredient" autocomplete="off" required>';
        html +=
            '<input type="number" name="quantity" class="form-control m-input" placeholder="Enter quantity" autocomplete="off" required>';
        html +=
            '<input type="text" name="units" class="form-control m-input" placeholder="Enter units" autocomplete="off" required>';
        html += '<div class="input-group-append">';
        html += '<button id="removeRow" type="button" class="btn btn-danger">Remove</button>';
        html += '</div>';
        html += '</div>';

        $('#ingredientRows').append(html);
        $(document).on('click', '#removeRow', function () {
            $(this).closest('#inputFormRow').remove();
        });
    });
});
