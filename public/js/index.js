
var updateInterval = 3000;
var $container = null;
var template = null;

var oldData = null;
var macAliases = localStorage;

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
    // is it already array?
    if (!_.isArray(data)) {
        data = _.map(data, function (value, key) {
            var time = new Date(value.time);
            return {
                mac: key,
                alias: macAliases[key] || key,
                temp: value.temp,
                time: time,
                hint: time.toLocaleString(),
                obsolete: isObsolete(key, time) ? "obsolete" : ""
            };
        });
    }

    if (!oldData || !_.all(_.zip(data, oldData), function (pair) {
            var data1 = pair[0];
            var data2 = pair[1];

            return data1.temp === data2.temp
                && data1.mac === data2.mac
                && data1.alias === data2.alias
                && data1.obsolete === data2.obsolete;
        })) {
        // animate changes
        $container.fadeOut(function () {
            oldData = data;

            var page = Mustache.render(template, {
                data: data
            });

            $container.html(page);
            subscribe($container);

            $container.fadeIn();
        });
    }
}

/**
 *
 * @param mac {String}
 * @param time {Date}
 * @returns {boolean}
 */
function isObsolete(mac, time) {
    var oldEntry = _.find(oldData, { mac: mac });
    if (!oldEntry)
        return false;

     return time <= oldEntry.time;
}

function subscribe($container) {
    $container.find('.entry').click(function(e) {
        var mac = $(e.target).data('mac');
        var alias = prompt('Enter alias for ' + mac, mac);
        if (!alias)
            return;

        macAliases[mac] = alias;
        render(oldData);
    });
}