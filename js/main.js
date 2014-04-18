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

        var orderHtml = '';
        $.each(conf.controlledLands.tyrell, function (orderIndex, orderLand){
            var order = conf.orders.tyrell.filter(function ( obj ) {
                if(obj.land === orderLand) { return obj }
            });

            orderHtml += '<div class="order' + orderIndex + ' order">';
            orderHtml += '<select name="tyrell-order-token" class="token"><option value="">---</option>';

            $.each(conf.controlledLands.tyrell, function (landIndex, landName) {
                console.log(landName);
                var selected = '';
                if(order[0] !== undefined && landName.land === order[0].land) { 
                    selected = 'selected';
                }
                orderHtml += '<option value="'+ landName.land +'" ' + selected + '>'+ landName.land +'</option>';
              
            });
            orderHtml += '</select>';
            orderHtml += '<select name="tyrell-order-land" class="land"><option value="">---</option>';
            $.each(conf.orderTokens, function (tokenIndex) {
                var selected = '';
                if(order[0] !== undefined && tokenIndex === order[0].token) { 
                    selected = 'selected';
                }
                orderHtml += '<option value="'+ tokenIndex +'" ' + selected + '>'+ tokenIndex +'</option>';
            });
            orderHtml += '</select>';
            orderHtml += '</div>';

        });
        $('.tyrell-controls .orders').html(orderHtml);

        var unitHtml = '';
        unitHtml += '<select name="tyrell-new-unit-land" class="land"><option value="">---</option>';
        $.each(conf.lands, function (landIndex, land){
            unitHtml += '<option value="'+ land.land +'">'+ land.land +'</option>';
        });
        unitHtml += '</select>';
        unitHtml += '<select name="tyrell-new-unit-rank" class="unitRank"><option value="">---</option>';
        $.each(conf.units, function (unit, value){
            unitHtml += '<option value="'+ unit +'">'+ unit +'</option>';
        });
        unitHtml += '</select>';

        $('.tyrell-controls .newUnit').html(unitHtml);


        // wildling token
        htmlString += '<div class="wildlingmarker pos-wilding-' + conf.wildlings + '"></div>';
        // round token
        htmlString += '<div class="round pos-round-' + conf.round + '"></div>';
        // Influence Tracks
        // Iron Throne
        $.each(conf.ironThroneOrder, function (place, house) {
              htmlString += '<div class="token-' + house + ' pos-throne-' + place + '"></div>';
        });
     
        // Fiefdom
        $.each(conf.fiefdomOrder, function (place, house) {
            htmlString += '<div class="token-' + house + ' pos-fiefdom-' + place + '"></div>';
        });
        
        // King's Court
        $.each(conf.kingsCourtOrder, function (place, house) {
            htmlString += '<div class="token-' + house + ' pos-court-' + place + '"></div>';
        });

        // Supply
        $.each(conf.supply, function (house, supply) {
            htmlString += '<div class="supply-' + house + ' pos-supply-' + supply + '"></div>';
        });
        // Victory
        $.each(conf.victory, function (house, points) {
            htmlString += '<div class="victory-' + house + ' pos-victory-' + points + '"></div>';
        });
        // Garrisons
        $.each(conf.garrisons, function (house, garrison) {
            htmlString += '<div class="garrison pos-' + house + '" data-value="' + garrison + '"></div>';
        });
        // VSB and Raven token
        htmlString += '<div class="vsb-token ' + (conf.vsbUsed ? 'used' : 'unused') + '"></div>';
        htmlString += '<div class="raven-token ' + (conf.ravenUsed ? 'used' : 'unused') + '"></div>';
        // Units

        $.each(conf.controlledLands, function (houseIndex, house) {
            $.each(house, function (landIndex, land) {
                $.each(land.units, function (unit, count) {
                    if(count > 0) {
                        htmlString += '<div class="' + unit + '-' + houseIndex + ' pos-' + land.land + ' unit"><div class="remove"></div></div>';
                    }
                });
            });
        });

        $.each(conf.orders, function (index, house) {
            $.each(house, function (index, order) {
                htmlString += '<div class="order-' + order['token'] + ' pos-' + order['land'] + '"></div>';
            });
        });

        // Power Tokens on the board
        // for(var house in conf.powertokens) {
        //     if (conf.powertokens[house].length > 0) {
        //         value = conf.powertokens[house].split('\n');
        //         for(var i = 0; i < value.length; i += 1) {
        //             var area = value[i].toLowerCase().replace(/ - port$/, '-harbor').replace(/([' ]|^the )/g, '');
        //             htmlString += '<div class="powertoken-' + house + ' pos-' + area + '"></div>';
        //         }
        //     }
        // }
        $.each(conf.powertokens, function (house, count) {
            htmlString += '<div class="tokenCounts-' + house + ' powertoken-' + house + '">';
            // available Power Tokens
            htmlString += '<div class="availablePowertokens">';
            htmlString += count
            htmlString += '</div>';
            // left Power Tokens
            htmlString += '<div class="leftPowertokens">';
            htmlString += conf.max.powertokens - count;
            htmlString += '</div>';
            htmlString += '</div>';
        });
        // for(var house in conf.availablePowertokens) {
          
        // }
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
    currentConf = {
        'wildlings': 2,
        'round': 2,
        'ironThroneOrder':
        {
            1: 'baratheon',
            2: 'lannister',
            3: 'stark',
            4: 'martell',
            5: 'greyjoy',
            6: 'tyrell',
        },
        'fiefdomOrder':
        {
            1: 'greyjoy',
            2: 'tyrell',
            3: 'martell',
            4: 'stark',
            5: 'baratheon',
            6: 'lannister',
        },
        'kingsCourtOrder':
        {
            1: 'lannister',
            2: 'stark',
            3: 'martell',
            4: 'baratheon',
            5: 'tyrell',
            6: 'greyjoy',
        },
        'garrisons':  
        {        
            'kingslanding': 5,
            'eyrie': 6,
            'dragonstone': 2,
            'winterfell': 2,
            'lannisport': 2,
            'highgarden': 2,
            'sunspear': 2,
            'pyke': 2,
        },
        'supply':   
        {
            'lannister': 2,
            'stark': 1,
            'martell': 2,
            'baratheon': 2,
            'tyrell': 2,
            'greyjoy': 2,
        },
        'victory':  {
            'lannister': 1,
            'stark': 2,
            'martell': 1,
            'baratheon': 1,
            'tyrell': 1,
            'greyjoy': 1,
        },
        'vsbUsed': false,
        'ravenUsed': false,
        'orderTokens':
        {
            'march-0': 0,
            'march-1': 1,
            'march-2': -1,
            'defend-0': 0,
            'defend-1': 1,
            'defend-2': 1
        },
        'orders' : 
        {
            'baratheon' : [],
            'greyjoy' : [],
            'lannister' : [],
            'martell' : [],
            'stark' : [],
            'tyrell' : []
        },
        'controlledLands' : 
        {
            'tyrell':
            [
                {
                    'land': 'highgarden',
                    'units':
                    {
                        'knight': 1,
                        'footman': 1,
                        'ship': 0,
                        'powertoken': 0
                    }
                },
                {
                    'land': 'oldtown',
                    'units':
                    {
                        'knight': 1,
                        'footman': 1,
                        'ship': 0,
                        'powertoken': 0
                    }
                }
            ],
            'greyjoy' : [],
            'lannister' : [],
            'martell' : [],
            'stark' : [],
            'baratheon' : []
        },
        'lands':
        [
           {
                'land': 'twins',
                'terrain': 'land',
                'occupied': true
            },
               {
                'land': 'fingers',
                'terrain': 'land',
                'occupied': true
            },
               {
                'land': 'mountainsofthemoon',
                'terrain': 'land',
                'occupied': true
            },
               {
                'land': 'eyrie',
                'terrain': 'land',
                'occupied': true
            },
               {
                'land': 'crackclawpoint',
                'terrain': 'land',
                'occupied': true
            },
                {
                'land': 'kingslanding',
                'terrain': 'land',
                'occupied': true
            },
                {
                'land': 'threetowers',
                'terrain': 'land',
                'occupied': true
            },
                {
                'land': 'blackwaterbay',
                'terrain': 'land',
                'occupied': true
            },
                {
                'land': 'eastsummersea',
                'terrain': 'land',
                'occupied': true
            },
                {
                'land': 'westsummerseaa',
                'terrain': 'land',
                'occupied': true
            },
                {
                'land': 'arbor',
                'terrain': 'land',
                'occupied': true
            },
              {
                'land': 'boneway',
                'terrain': 'land',
                'occupied': true
            },
              {
                'land': 'princespass',
                'terrain': 'land',
                'occupied': true
            },
              {
                'land': 'yronwood',
                'terrain': 'land',
                'occupied': true
            },
              {
                'land': 'stormsend',
                'terrain': 'land',
                'occupied': true
            },
              {
                'land': 'stormsend-harbor',
                'terrain': 'land',
                'occupied': true
            },
              {
                'land': 'starfall',
                'terrain': 'land',
                'occupied': true
            },
              {
                'land': 'highgarden',
                'terrain': 'land',
                'occupied': true
            },
                          {
                'land': 'dornishmarches',
                'terrain': 'land',
                'occupied': true
            },
                          {
                'land': 'oldtown',
                'terrain': 'land',
                'occupied': true
            },
                          {
                'land': 'oldtown-harbor',
                'terrain': 'land',
                'occupied': true
            },
                          {
                'land': 'redwynestraights',
                'terrain': 'land',
                'occupied': true
            },
                             {
                'land': 'sunspear',
                'terrain': 'land',
                'occupied': true
            },

                 {
                'land': 'sunspear-harbor',
                'terrain': 'land',
                'occupied': true
            },

                 {
                'land': 'saltshore',
                'terrain': 'land',
                'occupied': true
            },

                 {
                'land': 'seaofdorne',
                'terrain': 'land',
                'occupied': true
            },

                 {
                'land': 'pyke',
                'terrain': 'land',
                'occupied': true
            },

                 {
                'land': 'pyke-harbor',
                'terrain': 'land',
                'occupied': true
            },

                 {
                'land': 'sunsetsea',
                'terrain': 'land',
                'occupied': true
            },

                 {
                'land': 'goldensound',
                'terrain': 'land',
                'occupied': true
            },

                 {
                'land': 'lannisport',
                'terrain': 'land',
                'occupied': true
            },


                 {
                'land': 'lannisport-harbor',
                'terrain': 'land',
                'occupied': true
            },

                 {
                'land': 'stoneysept',
                'terrain': 'land',
                'occupied': true
            },

                 {
                'land': 'harrenhal',
                'terrain': 'land',
                'occupied': true
            },

                 {
                'land': 'riverrun',
                'terrain': 'land',
                'occupied': true
            },          {
                'land': 'searoadmarches',
                'terrain': 'land',
                'occupied': true
            },          {
                'land': 'blackwater',
                'terrain': 'land',
                'occupied': true
            },          {
                'land': 'reach',
                'terrain': 'land',
                'occupied': true
            },          {
                'land': 'seagard',
                'terrain': 'land',
                'occupied': true
            },          {
                'land': 'ironmansbay',
                'terrain': 'land',
                'occupied': true
            },          {
                'land': 'winterfell-harbor',
                'terrain': 'land',
                'occupied': true
            },          {
                'land': 'karhold',
                'terrain': 'land',
                'occupied': true
            },          {
                'land': 'stonyshore',
                'terrain': 'land',
                'occupied': true
            },          {
                'land': 'whiteharbor',
                'terrain': 'land',
                'occupied': true
            },          {
                'land': 'whiteharbor-harbor',
                'terrain': 'land',
                'occupied': true
            },
          {
                'land': 'widowswatch',
                'terrain': 'land',
                'occupied': true
            },
          {
                'land': 'flintsfinger',
                'terrain': 'land',
                'occupied': true
            },
          {
                'land': 'greywaterwatch',
                'terrain': 'land',
                'occupied': true
            },
          {
                'land': 'moatcailin',
                'terrain': 'land',
                'occupied': true
            },          {
                'land': 'dragonstone',
                'terrain': 'land',
                'occupied': true
            },          {
                'land': 'dragonstone-harbor',
                'terrain': 'land',
                'occupied': true
            },          {
                'land': 'kingswood',
                'terrain': 'land',
                'occupied': true
            },          {
                'land': 'bayofice',
                'terrain': 'land',
                'occupied': true
            },          {
                'land': 'shiveringsea',
                'terrain': 'land',
                'occupied': true
            },          {
                'land': 'narrowsea',
                'terrain': 'land',
                'occupied': true
            },          {
                'land': 'shipbreakerbay',
                'terrain': 'land',
                'occupied': true
            },          {
                'land': 'winterfell',
                'terrain': 'land',
                'occupied': true
            },    {
                'land': 'castleblack',
                'terrain': 'land',
                'occupied': true
            },
        ],
        'units':
        {
            'knight': 2,
            'footman': 1,
            'ship': 1
        },
        'powertokens': {
            'baratheon': 5,
            'greyjoy': 5,
            'lannister': 5,
            'martell': 5,
            'stark': 5,
            'tyrell': 5,
        },
        'max':
        {
            'powertokens': 20,
        }
    },
    getConf = function (currentConf) {
        currentConf = {
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
            "controlledLands": currentConf.controlledLands,
            "orders": currentConf.orders,
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
        return currentConf;
    }
    calcMap = function () {

    },
    calcOrders = function () {
        var orders = $(event.delegateTarget).find('.orders');
        var ordersCount = orders.length;
        orders.each(function (index, value) {

            var token = $(this).find('.token').val();
            var land = $(this).find('.land').val();

            var house = $(event.delegateTarget).data('house');
            settings.orders[house].push({"land": land, "token": token});
        });
    },
    calcControlledLand = function() {

    };

// inital setting of the board
try {
    var hash = location.hash;
    if (hash.indexOf('#') === 0) {
        hash = hash.substr(1);
    }
    // console.log(hash.length);
    if (hash.length > 0) {
        var conf;
        try {
            // try to see if we already have JSON (from older versions of the link)
            conf = $.deparam(hash)
        } catch (e) {
            // nope, lets do the decode and decompress routine
             console.log(e);
        }
        setBoard(conf);
        console.log(settings);
        setConf(conf);
    } else {
        throw 'No Conf in hash';
    }
} catch (e) {
    setBoard(currentConf);
};


// add orders with drop downs
$('.navContent').on('click', '.placeOrder', function (event) {
    var orders = $(event.delegateTarget).find('.orders');
    var ordersCount = orders.length;
    orders.each(function (index, value) {

        var token = $(this).find('.token').val();
        var land = $(this).find('.land').val();

        var house = $(event.delegateTarget).data('house');
        settings.orders[house].push({"land": land, "token": token});
    });
    var hash = $.param(getConf(currentConf));
    location.hash = hash;

});

$('.navContent').on('click', '.placeUnit', function (event) {
    var orders = $(event.delegateTarget).find('.newUnit');
    var ordersCount = orders.length;
    orders.each(function (index, value) {

        var unitRank = $(this).find('.unitRank').val();
        var land = $(this).find('.land').val();

        console.log(unitRank);
        console.log(land);

        var house = $(event.delegateTarget).data('house');
        var occupied = currentConf.controlledLands[house].filter(function ( obj ) {
            if(obj !== undefined && obj.land === land) { return obj }
        });
        if(occupied === 0) {
            occupied.units[unitRank] += 1;
        }else{
            var newUnit =
            {
                'land': land,
                'units':
                {
                    'knight': 0,
                    'footman': 0,
                    'ship': 0,
                    'powertoken': 0
                }
            };
            newUnit.units[unitRank] += 1;
            currentConf.controlledLands[house].push(newUnit);
        }
    });
    conf = getConf(currentConf);
    console.log(conf);
    // var hash = $.param(conf);
    // location.hash = hash;
});

// setting hash on form change
$('.navContent .updateBoard :input').on('change', function () {
    // var hash = Base64.urlSafeEncode(LZString.compress(JSON.stringify(getConf())));
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
        // conf = JSON.parse(denavcodeURIComponent(hash));
        conf = $.param(hash);
        // conf = decodeURIComponent( $.param( hash ) );
        // conf = JSON.parse('{"' + (conf).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
        console.log('Hased on change');

    } catch (e) {
        console.log(e);
        console.log('failed to apply new settings');
        // nope, lets do the decode and decompress routine
    }
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

// jQuery Deparam - v0.1.0 - 6/14/2011
// http://benalman.com/
// Copyright (c) 2011 Ben Alman; Licensed MIT, GPL

(function($) {
  // Creating an internal undef value is safer than using undefined, in case it
  // was ever overwritten.
  var undef;
  // A handy reference.
  var decode = decodeURIComponent;

  // Document $.deparam.
  var deparam = $.deparam = function(text, reviver) {
    // The object to be returned.
    var result = {};
    // Iterate over all key=value pairs.
    $.each(text.replace(/\+/g, ' ').split('&'), function(index, pair) {
      // The key=value pair.
      var kv = pair.split('=');
      // The key, URI-decoded.
      var key = decode(kv[0]);
      // Abort if there's no key.
      if ( !key ) { return; }
      // The value, URI-decoded. If value is missing, use empty string.
      var value = decode(kv[1] || '');
      // If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
      // into its component parts.
      var keys = key.split('][');
      var last = keys.length - 1;
      // Used when key is complex.
      var i = 0;
      var current = result;

      // If the first keys part contains [ and the last ends with ], then []
      // are correctly balanced.
      if ( keys[0].indexOf('[') >= 0 && /\]$/.test(keys[last]) ) {
        // Remove the trailing ] from the last keys part.
        keys[last] = keys[last].replace(/\]$/, '');
        // Split first keys part into two parts on the [ and add them back onto
        // the beginning of the keys array.
        keys = keys.shift().split('[').concat(keys);
        // Since a key part was added, increment last.
        last++;
      } else {
        // Basic 'foo' style key.
        last = 0;
      }

      if ( $.isFunction(reviver) ) {
        // If a reviver function was passed, use that function.
        value = reviver(key, value);
      } else if ( reviver ) {
        // If true was passed, use the built-in $.deparam.reviver function.
        value = deparam.reviver(key, value);
      }

      if ( last ) {
        // Complex key, like 'a[]' or 'a[b][c]'. At this point, the keys array
        // might look like ['a', ''] (array) or ['a', 'b', 'c'] (object).
        for ( ; i <= last; i++ ) {
          // If the current key part was specified, use that value as the array
          // index or object key. If omitted, assume an array and use the
          // array's length (effectively an array push).
          key = keys[i] !== '' ? keys[i] : current.length;
          if ( i < last ) {
            // If not the last key part, update the reference to the current
            // object/array, creating it if it doesn't already exist AND there's
            // a next key. If the next key is non-numeric and not empty string,
            // create an object, otherwise create an array.
            current = current[key] = current[key] || (isNaN(keys[i + 1]) ? {} : []);
          } else {
            // If the last key part, set the value.
            current[key] = value;
          }
        }
      } else {
        // Simple key.
        if ( $.isArray(result[key]) ) {
          // If the key already exists, and is an array, push the new value onto
          // the array.
          result[key].push(value);
        } else if ( key in result ) {
          // If the key already exists, and is NOT an array, turn it into an
          // array, pushing the new value onto it.
          result[key] = [result[key], value];
        } else {
          // Otherwise, just set the value.
          result[key] = value;
        }
      }
    });

    return result;
  };

  // Default reviver function, used when true is passed as the second argument
  // to $.deparam. Don't like it? Pass your own!
  deparam.reviver = function(key, value) {
    var specials = {
      'true': true,
      'false': false,
      'null': null,
      'undefined': undef
    };

    return (+value + '') === value ? +value // Number
      : value in specials ? specials[value] // true, false, null, undefined
      : value; // String
  };

}(jQuery));