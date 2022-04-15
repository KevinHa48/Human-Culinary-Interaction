$(document).ready(function () {
    $('#recipeForm').submit(function (event) {
        event.preventDefault();

        let title = $('#title').val();
        let poster = $('#username').attr('val');
        let img = $('#image').val();
        let description = $('#descrption').val();

        let stepArray = [];
        $('input[name=step]').each(function () {
            stepArray.push($(this).val());
        });

        let ingredientArray = [];
        $('input[name=ingredient]').each(function () {
            ingredientArray.push($(this).val());
        });

        const newRecipe = {
            title: title,
            img: img,
            poster: poster,
            description: description,
            directions: stepArray,
            ingredients: ingredientArray,
        };

        console.log(newRecipe);
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
            '<input type="text" name="ingredient" class="form-control m-input" placeholder="Enter ingredient" autocomplete="off">';
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
