$(window).load(function(){

var $board = $('.board'),
    setShortLink = function (href) {
        var characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            string = '',
            charCnt = 20,
            uri;
        for (var i = 0; i < charCnt; i += 1) {
            string += characters[Math.floor(Math.random() * characters.length)];
        }
        uri = 'http://tinyurl.com/create.php?source=indexpage&url=' + encodeURIComponent(href) + '&alias=' + string;
        $('body').append('<img src="' + uri + '" style="height: 1px; width: 1px; position: absolute; z-index: -999; opacity: 0;" />');
        $('#shortlink').html('http://tinyurl.com/' + string);
    },
    setBoard = function (conf) {
        var value,
            htmlString = '';
        // wildling token
        htmlString += '<div class="wildlingmarker pos-wilding-' + conf.wildlings + '"></div>';
        // round token
        htmlString += '<div class="round pos-round-' + conf.round + '"></div>';
        // Influence Tracks
        // Iron Throne
        value = conf.ironThroneOrder.split('\n');
        for(var i = 0; i < value.length; i += 1) {
            htmlString += '<div class="token-' + value[i].toLowerCase() + ' pos-throne-' + (i + 1) + '"></div>';
        }
        // Fiefdom
        value = conf.fiefdomOrder.split('\n');
        for(var i = 0; i < value.length; i += 1) {
            htmlString += '<div class="token-' + value[i].toLowerCase() + ' pos-fiefdom-' + (i + 1) + '"></div>';
        }
        // King's Court
        value = conf.kingsCourtOrder.split('\n');
        for(var i = 0; i < value.length; i += 1) {
            htmlString += '<div class="token-' + value[i].toLowerCase() + ' pos-court-' + (i + 1) + '"></div>';
        }
        // Supply
        value = conf.supply.split('\n');
        for(var i = 0; i < value.length; i += 1) {
            htmlString += '<div class="supply-' + value[i].toLowerCase().split(': ')[0] + ' pos-supply-' + value[i].split(': ')[1] + '"></div>';
        }
        // Victory
        value = conf.victory.split('\n');
        for(var i = 0; i < value.length; i += 1) {
            htmlString += '<div class="victory-' + value[i].toLowerCase().split(': ')[0] + ' pos-victory-' + value[i].split(': ')[1] + '"></div>';
        }
        // Garrisons
        value = conf.garrisons.split('\n');
        for(var i = 0; i < value.length; i += 1) {
            htmlString += '<div class="garrison pos-' + value[i].toLowerCase().split(': ')[0].toLowerCase().replace(/ - port$/, '-harbor').replace(/([' ]|^the )/g, '') + '" data-value="' + value[i].split(': ')[1] + '"></div>';
        }
        // VSB and Raven token
        htmlString += '<div class="vsb-token ' + (conf.vsbUsed ? 'used' : 'unused') + '"></div>';
        htmlString += '<div class="raven-token ' + (conf.ravenUsed ? 'used' : 'unused') + '"></div>';
        // Units
        for(var house in conf.units) {
            if (conf.units[house].length > 0) {
                foo = conf.units;
                value = conf.units[house]
                    .replace(/ (routed-)?kn(,|\n|$)/ig, ' $1knight$2')
                    .replace(/ (routed-)?fm(,|\n|$)/ig, ' $1footman$2')
                    .replace(/ (routed-)?se(,|\n|$)/ig, ' $1siege$2')
                    .replace(/ (routed-)?sh(,|\n|$)/ig, ' $1ship$2')
                    .split('\n');
                for(var i = 0; i < value.length; i += 1) {
                    var valueSplitted = value[i].split(': '),
                        area = valueSplitted[0].toLowerCase().replace(/ - port$/, '-harbor').replace(/([' ]|^the )/g, ''),
                        units = valueSplitted[1].split(', ');
                    for(var j = 0; j < units.length; j += 1) {
                        htmlString += '<div class="' + units[j].toLowerCase() + '-' + house + ' pos-' + area + ' unit"></div>';
                    }
                }
            }
        }
        // Orders
        for(var house in settings.orders) {
            // var ordersString = conf.orders[house]
            // if (ordersString.length > 0) {
            //     var orders = ordersString.split("|");
            //     for (var i = 0; i < orders.length; i++) {
            //         var order = $.parseJSON(orders[i]);
                // }
            // }
            console.log(house);
            // htmlString += '<div class="order-' + order['token'] + ' pos-' + order['land'] + '"></div>';
        }
        // Power Tokens on the board
        for(var house in conf.powertokens) {
            if (conf.powertokens[house].length > 0) {
                value = conf.powertokens[house].split('\n');
                for(var i = 0; i < value.length; i += 1) {
                    var area = value[i].toLowerCase().replace(/ - port$/, '-harbor').replace(/([' ]|^the )/g, '');
                    htmlString += '<div class="powertoken-' + house + ' pos-' + area + '"></div>';
                }
            }
        }
        for(var house in conf.availablePowertokens) {
            htmlString += '<div class="tokenCounts-' + house + ' powertoken-' + house + '">';
            // available Power Tokens
            htmlString += '<div class="availablePowertokens">';
            htmlString += conf.availablePowertokens[house];
            htmlString += '</div>';
            // left Power Tokens
            htmlString += '<div class="leftPowertokens">';
            htmlString += conf.maxPowertokens - conf.availablePowertokens[house] - (conf.powertokens[house].length > 0 ? conf.powertokens[house].split('\n').length : 0);
            htmlString += '</div>';
            htmlString += '</div>';
        }
		// housecard tracking
		for(var house in conf.housecards) {
			var housecards = conf.housecards[house].split('\n');
			for (var i = 0; i < housecards.length; i += 1) {
				$('[name="housecard-' + i + '-' + house + '"] + label').html(housecards[i]);
			}
		}
        $(':not(input)', $board).remove();
        $(htmlString).appendTo($board);
    },
    getConf = function () {
        var conf = {
            "wildlings": $('[name="wildlings"]').val(),
            "round": $('[name="round"]').val(),
            "ironThroneOrder": $('[name="ironThroneOrder"]').val(),
            "fiefdomOrder": $('[name="fiefdomOrder"]').val(),
            "kingsCourtOrder": $('[name="kingsCourtOrder"]').val(),
            "garrisons": $('[name="garrisons"]').val(),
            "supply": $('[name="supply"]').val(),
            "victory": $('[name="victory"]').val(),
            "vsbUsed": $('[name="vsb-used"]').attr('checked'),
            "ravenUsed": $('[name="raven-used"]').attr('checked'),

            "units": {
                "baratheon": $('[name="units-baratheon"]').val(),
                "greyjoy": $('[name="units-greyjoy"]').val(),
                "lannister": $('[name="units-lannister"]').val(),
                "martell": $('[name="units-martell"]').val(),
                "stark": $('[name="units-stark"]').val(),
                "tyrell": $('[name="units-tyrell"]').val()
            },

            "orders": {
                "baratheon": $('[name="orders-baratheon"]').val(),
                "greyjoy": $('[name="orders-greyjoy"]').val(),
                "lannister": $('[name="orders-lannister"]').val(),
                "martell": $('[name="orders-martell"]').val(),
                "stark": $('[name="orders-stark"]').val(),
                "tyrell": settings.orders.tyrell
            },

            "powertokens": {
                "baratheon": $('[name="powertokens-baratheon"]').val(),
                "greyjoy": $('[name="powertokens-greyjoy"]').val(),
                "lannister": $('[name="powertokens-lannister"]').val(),
                "martell": $('[name="powertokens-martell"]').val(),
                "stark": $('[name="powertokens-stark"]').val(),
                "tyrell": $('[name="powertokens-tyrell"]').val()
            },

            "housecards": {
                "baratheon": $('[name="housecards-baratheon"]').val(),
                "greyjoy": $('[name="housecards-greyjoy"]').val(),
                "lannister": $('[name="housecards-lannister"]').val(),
                "martell": $('[name="housecards-martell"]').val(),
                "stark": $('[name="housecards-stark"]').val(),
                "tyrell": $('[name="housecards-tyrell"]').val()
            },

			"housecardTracking": {
				"baratheon": [
					$('[name="housecard-0-baratheon"]').is(':checked'),
					$('[name="housecard-1-baratheon"]').is(':checked'),
					$('[name="housecard-2-baratheon"]').is(':checked'),
					$('[name="housecard-3-baratheon"]').is(':checked'),
					$('[name="housecard-4-baratheon"]').is(':checked'),
					$('[name="housecard-5-baratheon"]').is(':checked'),
					$('[name="housecard-6-baratheon"]').is(':checked')
				],
				"greyjoy": [
					$('[name="housecard-0-greyjoy"]').is(':checked'),
					$('[name="housecard-1-greyjoy"]').is(':checked'),
					$('[name="housecard-2-greyjoy"]').is(':checked'),
					$('[name="housecard-3-greyjoy"]').is(':checked'),
					$('[name="housecard-4-greyjoy"]').is(':checked'),
					$('[name="housecard-5-greyjoy"]').is(':checked'),
					$('[name="housecard-6-greyjoy"]').is(':checked')
				],
				"lannister": [
					$('[name="housecard-0-lannister"]').is(':checked'),
					$('[name="housecard-1-lannister"]').is(':checked'),
					$('[name="housecard-2-lannister"]').is(':checked'),
					$('[name="housecard-3-lannister"]').is(':checked'),
					$('[name="housecard-4-lannister"]').is(':checked'),
					$('[name="housecard-5-lannister"]').is(':checked'),
					$('[name="housecard-6-lannister"]').is(':checked')
				],
				"martell": [
					$('[name="housecard-0-martell"]').is(':checked'),
					$('[name="housecard-1-martell"]').is(':checked'),
					$('[name="housecard-2-martell"]').is(':checked'),
					$('[name="housecard-3-martell"]').is(':checked'),
					$('[name="housecard-4-martell"]').is(':checked'),
					$('[name="housecard-5-martell"]').is(':checked'),
					$('[name="housecard-6-martell"]').is(':checked')
				],
				"stark": [
					$('[name="housecard-0-stark"]').is(':checked'),
					$('[name="housecard-1-stark"]').is(':checked'),
					$('[name="housecard-2-stark"]').is(':checked'),
					$('[name="housecard-3-stark"]').is(':checked'),
					$('[name="housecard-4-stark"]').is(':checked'),
					$('[name="housecard-5-stark"]').is(':checked'),
					$('[name="housecard-6-stark"]').is(':checked')
				],
				"tyrell": [
					$('[name="housecard-0-tyrell"]').is(':checked'),
					$('[name="housecard-1-tyrell"]').is(':checked'),
					$('[name="housecard-2-tyrell"]').is(':checked'),
					$('[name="housecard-3-tyrell"]').is(':checked'),
					$('[name="housecard-4-tyrell"]').is(':checked'),
					$('[name="housecard-5-tyrell"]').is(':checked'),
					$('[name="housecard-6-tyrell"]').is(':checked')
				]
			},

            "availablePowertokens": {
                "baratheon": $('[name="availablePowertokens-baratheon"]').val(),
                "greyjoy": $('[name="availablePowertokens-greyjoy"]').val(),
                "lannister": $('[name="availablePowertokens-lannister"]').val(),
                "martell": $('[name="availablePowertokens-martell"]').val(),
                "stark": $('[name="availablePowertokens-stark"]').val(),
                "tyrell": $('[name="availablePowertokens-tyrell"]').val()
            },

            "maxPowertokens": $('[name="maxPowertokens"]').val()
        }
        return conf;
    },
    setConf = function (conf) {
        $('[name="wildlings"]').val(conf.wildlings);
        $('[name="round"]').val(conf.round);
        $('[name="ironThroneOrder"]').val(conf.ironThroneOrder);
        $('[name="fiefdomOrder"]').val(conf.fiefdomOrder);
        $('[name="kingsCourtOrder"]').val(conf.kingsCourtOrder);
        $('[name="garrisons"]').val(conf.garrisons);
        $('[name="supply"]').val(conf.supply);
        $('[name="victory"]').val(conf.victory);
        $('[name="vsb-used"]').attr('checked', conf.vsbUsed);
        $('[name="raven-used"]').attr('checked', conf.ravenUsed);

        $('[name="units-baratheon"]').val(conf.units.baratheon);
        $('[name="units-greyjoy"]').val(conf.units.greyjoy);
        $('[name="units-lannister"]').val(conf.units.lannister);
        $('[name="units-martell"]').val(conf.units.martell);
        $('[name="units-stark"]').val(conf.units.stark);
        $('[name="units-tyrell"]').val(conf.units.tyrell);

        $('[name="orders-baratheon"]').val(conf.orders.baratheon);
        $('[name="orders-greyjoy"]').val(conf.orders.greyjoy);
        $('[name="orders-lannister"]').val(conf.orders.lannister);
        $('[name="orders-martell"]').val(conf.orders.martell);
        $('[name="orders-stark"]').val(conf.orders.stark);
        settings.orders.tyrell = conf.orders.tyrell;

        $('[name="powertokens-baratheon"]').val(conf.powertokens.baratheon);
        $('[name="powertokens-greyjoy"]').val(conf.powertokens.greyjoy);
        $('[name="powertokens-lannister"]').val(conf.powertokens.lannister);
        $('[name="powertokens-martell"]').val(conf.powertokens.martell);
        $('[name="powertokens-stark"]').val(conf.powertokens.stark);
        $('[name="powertokens-tyrell"]').val(conf.powertokens.tyrell);

        $('[name="housecards-baratheon"]').val(conf.housecards.baratheon);
        $('[name="housecards-greyjoy"]').val(conf.housecards.greyjoy);
        $('[name="housecards-lannister"]').val(conf.housecards.lannister);
        $('[name="housecards-martell"]').val(conf.housecards.martell);
        $('[name="housecards-stark"]').val(conf.housecards.stark);
        $('[name="housecards-tyrell"]').val(conf.housecards.tyrell);

		if (conf.housecardTracking) {
			$('[name="housecard-0-baratheon"]').attr('checked', conf.housecardTracking.baratheon[0]);
			$('[name="housecard-1-baratheon"]').attr('checked', conf.housecardTracking.baratheon[1]);
			$('[name="housecard-2-baratheon"]').attr('checked', conf.housecardTracking.baratheon[2]);
			$('[name="housecard-3-baratheon"]').attr('checked', conf.housecardTracking.baratheon[3]);
			$('[name="housecard-4-baratheon"]').attr('checked', conf.housecardTracking.baratheon[4]);
			$('[name="housecard-5-baratheon"]').attr('checked', conf.housecardTracking.baratheon[5]);
			$('[name="housecard-6-baratheon"]').attr('checked', conf.housecardTracking.baratheon[6]);

			$('[name="housecard-0-greyjoy"]').attr('checked', conf.housecardTracking.greyjoy[0]);
			$('[name="housecard-1-greyjoy"]').attr('checked', conf.housecardTracking.greyjoy[1]);
			$('[name="housecard-2-greyjoy"]').attr('checked', conf.housecardTracking.greyjoy[2]);
			$('[name="housecard-3-greyjoy"]').attr('checked', conf.housecardTracking.greyjoy[3]);
			$('[name="housecard-4-greyjoy"]').attr('checked', conf.housecardTracking.greyjoy[4]);
			$('[name="housecard-5-greyjoy"]').attr('checked', conf.housecardTracking.greyjoy[5]);
			$('[name="housecard-6-greyjoy"]').attr('checked', conf.housecardTracking.greyjoy[6]);

			$('[name="housecard-0-lannister"]').attr('checked', conf.housecardTracking.lannister[0]);
			$('[name="housecard-1-lannister"]').attr('checked', conf.housecardTracking.lannister[1]);
			$('[name="housecard-2-lannister"]').attr('checked', conf.housecardTracking.lannister[2]);
			$('[name="housecard-3-lannister"]').attr('checked', conf.housecardTracking.lannister[3]);
			$('[name="housecard-4-lannister"]').attr('checked', conf.housecardTracking.lannister[4]);
			$('[name="housecard-5-lannister"]').attr('checked', conf.housecardTracking.lannister[5]);
			$('[name="housecard-6-lannister"]').attr('checked', conf.housecardTracking.lannister[6]);

			$('[name="housecard-0-martell"]').attr('checked', conf.housecardTracking.martell[0]);
			$('[name="housecard-1-martell"]').attr('checked', conf.housecardTracking.martell[1]);
			$('[name="housecard-2-martell"]').attr('checked', conf.housecardTracking.martell[2]);
			$('[name="housecard-3-martell"]').attr('checked', conf.housecardTracking.martell[3]);
			$('[name="housecard-4-martell"]').attr('checked', conf.housecardTracking.martell[4]);
			$('[name="housecard-5-martell"]').attr('checked', conf.housecardTracking.martell[5]);
			$('[name="housecard-6-martell"]').attr('checked', conf.housecardTracking.martell[6]);

			$('[name="housecard-0-stark"]').attr('checked', conf.housecardTracking.stark[0]);
			$('[name="housecard-1-stark"]').attr('checked', conf.housecardTracking.stark[1]);
			$('[name="housecard-2-stark"]').attr('checked', conf.housecardTracking.stark[2]);
			$('[name="housecard-3-stark"]').attr('checked', conf.housecardTracking.stark[3]);
			$('[name="housecard-4-stark"]').attr('checked', conf.housecardTracking.stark[4]);
			$('[name="housecard-5-stark"]').attr('checked', conf.housecardTracking.stark[5]);
			$('[name="housecard-6-stark"]').attr('checked', conf.housecardTracking.stark[6]);

			$('[name="housecard-0-tyrell"]').attr('checked', conf.housecardTracking.tyrell[0]);
			$('[name="housecard-1-tyrell"]').attr('checked', conf.housecardTracking.tyrell[1]);
			$('[name="housecard-2-tyrell"]').attr('checked', conf.housecardTracking.tyrell[2]);
			$('[name="housecard-3-tyrell"]').attr('checked', conf.housecardTracking.tyrell[3]);
			$('[name="housecard-4-tyrell"]').attr('checked', conf.housecardTracking.tyrell[4]);
			$('[name="housecard-5-tyrell"]').attr('checked', conf.housecardTracking.tyrell[5]);
			$('[name="housecard-6-tyrell"]').attr('checked', conf.housecardTracking.tyrell[6]);
		}

        $('[name="availablePowertokens-baratheon"]').val(conf.availablePowertokens.baratheon);
        $('[name="availablePowertokens-greyjoy"]').val(conf.availablePowertokens.greyjoy);
        $('[name="availablePowertokens-lannister"]').val(conf.availablePowertokens.lannister);
        $('[name="availablePowertokens-martell"]').val(conf.availablePowertokens.martell);
        $('[name="availablePowertokens-stark"]').val(conf.availablePowertokens.stark);
        $('[name="availablePowertokens-tyrell"]').val(conf.availablePowertokens.tyrell);

        $('[name="maxPowertokens"]').val(conf.maxPowertokens);
    },
    settings = {
        'orderTokens':
        {
            'm+0': 0,
            'm+1': 1,
            'm-1': -1,
            'd+0': 0,
            'd+1': 1
        },
        'orders' : 
        {
            'tyrell' : {}
        },
        'lands' :{
            0 : 'Oldtown',
            1 : 'Highgarden'
        }
    };

// inital setting of the board
try {
    var hash = location.hash;
    if (hash.indexOf('#') === 0) {
        hash = hash.substr(1);
    }
    if (hash.length > 0) {
        var conf;
		try {
			// try to see if we already have JSON (from older versions of the link)
			conf = JSON.parse(decodeURIComponent(hash));
             console.log(conf);

		} catch (e) {
			// nope, lets do the decode and decompress routine
			conf = JSON.parse(LZString.decompress(Base64.urlSafeDecode(hash)));
             console.log(conf);
		}

        setBoard(conf);
        setConf(conf);
    } else {
        throw 'No Conf in hash';
    }
} catch (e) {
    setBoard(getConf());
};


// add orders with drop downs
$('.navContent').on('click', '.placeOrder', function (event) {
    var orders = $(event.delegateTarget).find('.orders');
    var ordersCount = orders.length;
    orders.each(function (index, value) {

        var token = $(this).find('.token').val();
        var land = $(this).find('.land').val();

        var house = $(event.delegateTarget).data('house');
        var test = settings.orders[house];
        settings.orders[house] = {"land": land, "token": token};
    });

    var hash = Base64.urlSafeEncode(LZString.compress(JSON.stringify(getConf())));
    location.hash = hash;

});

// setting hash on form change
$('.navContent .updateBoard :input').on('change', function () {
	var hash = Base64.urlSafeEncode(LZString.compress(JSON.stringify(getConf())));
    location.hash = hash;
});

// setting board and form on hash change
$(window).on('hashchange', function () {
    var hash = location.hash;
    if (hash.indexOf('#') === 0) {
        hash = hash.substr(1);
    }

	var conf;
	try {
		// try to see if we already have JSON (from older versions of the link)
		conf = JSON.parse(denavcodeURIComponent(hash));

	} catch (e) {
        console.log(e);
        console.log('failed to apply new settings');
		// nope, lets do the decode and decompress routine
		conf = JSON.parse(LZString.decompress(Base64.urlSafeDecode(hash)));
	}
    setConf(conf);
    setBoard(getConf());
    setShortLink(location.href);
});
// click listener for powertoken change
$('body').on('click', function (e) {
    var $target = $(e.target);
    if ($target.hasClass('availablePowertokens')) {
        e.preventDefault();
        var $input = $('[name="available' + $target.parent().attr('class').replace(/.*powertoken-([^ ]*)/, 'Powertokens-\$1') + '"]');
        $input.val($input.val() - 1)
            .trigger('change');
    } else if ($target.hasClass('leftPowertokens')) {
        e.preventDefault();
        var $input = $('[name="available' + $target.parent().attr('class').replace(/.*powertoken-([^ ]*)/, 'Powertokens-\$1') + '"]');
        $input.val(+$input.val() + 1)
            .trigger('change');
    } else if ($target.hasClass('vsb-token')) {
        e.preventDefault();
        var $input = $('[name="vsb-used"]');
        $input.attr('checked', !$target.hasClass('used'))
            .trigger('change');
    } else if ($target.hasClass('raven-token')) {
        e.preventDefault();
        var $input = $('[name="raven-used"]');
        $input.attr('checked', !$target.hasClass('used'))
            .trigger('change');
    }
});
});
