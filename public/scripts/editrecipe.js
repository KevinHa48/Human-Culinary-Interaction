$(document).ready(function () {
    $('#submit').click(function (event) {
        event.preventDefault();

        let title = $('#title').val();
        let poster = $('#username').attr('val');
        let img = $('#image').val();
        let description = $('#descrption').val();

        let steps = $('#directions').val();

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

        const editedRecipe = {
            title: title,
            img: img,
            poster: poster,
            description: description,
            directions: steps,
            ingredients: ingredientArray,
        };

        console.log(editedRecipe);

        let id = $('#id').val();

        var formSubmitConfig = {
            method: 'POST',
            url: `/recipes/update/${id}`,
            contentType: 'application/json',
            data: JSON.stringify(editedRecipe),
            //This should never get called means server has errored/input validation in client side insufficient
            error: function (request) {
                alert('Adding a recipe failed make sure to include steps and ingredients');
                console.log(request.responseText);
            },
        };

        $.ajax(formSubmitConfig).then(function (responseMessage) {
            console.log(responseMessage);
            location.reload();
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
    });
    $(document).on('click', '#removeRow', function () {
        $(this).closest('#inputFormRow').remove();
    });
});
