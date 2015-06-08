
var updateInterval = 2000;
var $container = null;
var template = null;

var oldData = [];

$(function() {
    init();
    refresh();
});

function init() {
    $container = $('#data');
    template = $('#template').html();
}

function refresh(data) {
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: '/api/readAll',
        data: data
    })
        .done(function (msg) {
            render(msg);
        })
        .fail(function (error) {
            console.error(error);
            alert('Error. See details in console');
        });

    setTimeout(refresh, updateInterval);
}

function render(data) {
    data = _.map(data, function(value, key) {
        return {
            mac: key,
            temp: value.temp
        };
    });

    if (!_.isEqual(data, oldData)) {
        // animate changes
        $container.fadeOut(function () {
            oldData = data;
            var page = Mustache.render(template, {data: data});
            $container.html(page);
            $container.fadeIn();
        });
    }
}