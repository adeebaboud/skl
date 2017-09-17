dasApp.controller('addMenuController', ["$scope", "entityManager", "$uibModalInstance", "menu", "options", "menuManager", function ($scope, entityManager, $uibModalInstance,menu,options,menuManager) {
    $scope.title=options.title;
    $scope.allIcons = [  "fort-awesome lg valign-baseline",  "font-awesome",  "bars lg",  "caret-down",  "flag fw",  "wheelchair-alt fw",  "camera-retro fw",  "universal-access fw",  "hand-spock-o fw",  "ship fw",  "venus fw",  "file-image-o fw",  "spinner fw",  "check-square fw",  "credit-card fw",  "pie-chart fw",  "won fw",  "file-text-o fw",  "arrow-right fw",  "play-circle fw",  "facebook-official fw",  "medkit fw",  "universal-access",  "shopping-cart margin-right-sm hidden-sm hidden-md",  "flag",  "envelope",  "search",  "american-sign-language-interpreting",  "asl-interpreting",  "assistive-listening-systems",  "audio-description",  "blind",  "braille",  "deaf",  "deafness",  "envira",  "fa",  "first-order",  "gitlab",  "glide",  "glide-g",  "google-plus-circle",  "google-plus-official",  "hard-of-hearing",  "instagram",  "low-vision",  "pied-piper",  "question-circle-o",  "sign-language",  "signing",  "snapchat",  "snapchat-ghost",  "snapchat-square",  "themeisle",  "viadeo",  "viadeo-square",  "volume-control-phone",  "wheelchair-alt",  "wpbeginner",  "wpforms",  "yoast",  "adjust",  "anchor",  "archive",  "area-chart",  "arrows",  "arrows-h",  "arrows-v",  "asterisk",  "at",  "automobile",  "balance-scale",  "ban",  "bank",  "bar-chart",  "bar-chart-o",  "barcode",  "bars",  "battery-0",  "battery-1",  "battery-2",  "battery-3",  "battery-4",  "battery-empty",  "battery-full",  "battery-half",  "battery-quarter",  "battery-three-quarters",  "bed",  "beer",  "bell",  "bell-o",  "bell-slash",  "bell-slash-o",  "bicycle",  "binoculars",  "birthday-cake",  "bluetooth",  "bluetooth-b",  "bolt",  "bomb",  "book",  "bookmark",  "bookmark-o",  "briefcase",  "bug",  "building",  "building-o",  "bullhorn",  "bullseye",  "bus",  "cab",  "calculator",  "calendar",  "calendar-check-o",  "calendar-minus-o",  "calendar-o",  "calendar-plus-o",  "calendar-times-o",  "camera",  "camera-retro",  "car",  "caret-square-o-down",  "caret-square-o-left",  "caret-square-o-right",  "caret-square-o-up",  "cart-arrow-down",  "cart-plus",  "cc",  "certificate",  "check",  "check-circle",  "check-circle-o",  "check-square",  "check-square-o",  "child",  "circle",  "circle-o",  "circle-o-notch",  "circle-thin",  "clock-o",  "clone",  "close",  "cloud",  "cloud-download",  "cloud-upload",  "code",  "code-fork",  "coffee",  "cog",  "cogs",  "comment",  "comment-o",  "commenting",  "commenting-o",  "comments",  "comments-o",  "compass",  "copyright",  "creative-commons",  "credit-card",  "credit-card-alt",  "crop",  "crosshairs",  "cube",  "cubes",  "cutlery",  "dashboard",  "database",  "desktop",  "diamond",  "dot-circle-o",  "download",  "edit",  "ellipsis-h",  "ellipsis-v",  "envelope-o",  "envelope-square",  "eraser",  "exchange",  "exclamation",  "exclamation-circle",  "exclamation-triangle",  "external-link",  "external-link-square",  "eye",  "eye-slash",  "eyedropper",  "fax",  "feed",  "female",  "fighter-jet",  "file-archive-o",  "file-audio-o",  "file-code-o",  "file-excel-o",  "file-image-o",  "file-movie-o",  "file-pdf-o",  "file-photo-o",  "file-picture-o",  "file-powerpoint-o",  "file-sound-o",  "file-video-o",  "file-word-o",  "file-zip-o",  "film",  "filter",  "fire",  "fire-extinguisher",  "flag-checkered",  "flag-o",  "flash",  "flask",  "folder",  "folder-o",  "folder-open",  "folder-open-o",  "frown-o",  "futbol-o",  "gamepad",  "gavel",  "gear",  "gears",  "gift",  "glass",  "globe",  "graduation-cap",  "group",  "hand-grab-o",  "hand-lizard-o",  "hand-paper-o",  "hand-peace-o",  "hand-pointer-o",  "hand-rock-o",  "hand-scissors-o",  "hand-spock-o",  "hand-stop-o",  "hashtag",  "hdd-o",  "headphones",  "heart",  "heart-o",  "heartbeat",  "history",  "home",  "hotel",  "hourglass",  "hourglass-1",  "hourglass-2",  "hourglass-3",  "hourglass-end",  "hourglass-half",  "hourglass-o",  "hourglass-start",  "i-cursor",  "image",  "inbox",  "industry",  "info",  "info-circle",  "institution",  "key",  "keyboard-o",  "language",  "laptop",  "leaf",  "legal",  "lemon-o",  "level-down",  "level-up",  "life-bouy",  "life-buoy",  "life-ring",  "life-saver",  "lightbulb-o",  "line-chart",  "location-arrow",  "lock",  "magic",  "magnet",  "mail-forward",  "mail-reply",  "mail-reply-all",  "male",  "map",  "map-marker",  "map-o",  "map-pin",  "map-signs",  "meh-o",  "microphone",  "microphone-slash",  "minus",  "minus-circle",  "minus-square",  "minus-square-o",  "mobile",  "mobile-phone",  "money",  "moon-o",  "mortar-board",  "motorcycle",  "mouse-pointer",  "music",  "navicon",  "newspaper-o",  "object-group",  "object-ungroup",  "paint-brush",  "paper-plane",  "paper-plane-o",  "paw",  "pencil",  "pencil-square",  "pencil-square-o",  "percent",  "phone",  "phone-square",  "photo",  "picture-o",  "pie-chart",  "plane",  "plug",  "plus",  "plus-circle",  "plus-square",  "plus-square-o",  "power-off",  "print",  "puzzle-piece",  "qrcode",  "question",  "question-circle",  "quote-left",  "quote-right",  "random",  "recycle",  "refresh",  "registered",  "remove",  "reorder",  "reply",  "reply-all",  "retweet",  "road",  "rocket",  "rss",  "rss-square",  "search-minus",  "search-plus",  "send",  "send-o",  "server",  "share",  "share-alt",  "share-alt-square",  "share-square",  "share-square-o",  "shield",  "ship",  "shopping-bag",  "shopping-basket",  "shopping-cart",  "sign-in",  "sign-out",  "signal",  "sitemap",  "sliders",  "smile-o",  "soccer-ball-o",  "sort",  "sort-alpha-asc",  "sort-alpha-desc",  "sort-amount-asc",  "sort-amount-desc",  "sort-asc",  "sort-desc",  "sort-down",  "sort-numeric-asc",  "sort-numeric-desc",  "sort-up",  "space-shuttle",  "spinner",  "spoon",  "square",  "square-o",  "star",  "star-half",  "star-half-empty",  "star-half-full",  "star-half-o",  "star-o",  "sticky-note",  "sticky-note-o",  "street-view",  "suitcase",  "sun-o",  "support",  "tablet",  "tachometer",  "tag",  "tags",  "tasks",  "taxi",  "television",  "terminal",  "thumb-tack",  "thumbs-down",  "thumbs-o-down",  "thumbs-o-up",  "thumbs-up",  "ticket",  "times",  "times-circle",  "times-circle-o",  "tint",  "toggle-down",  "toggle-left",  "toggle-off",  "toggle-on",  "toggle-right",  "toggle-up",  "trademark",  "trash",  "trash-o",  "tree",  "trophy",  "truck",  "tty",  "tv",  "umbrella",  "university",  "unlock",  "unlock-alt",  "unsorted",  "upload",  "user",  "user-plus",  "user-secret",  "user-times",  "users",  "video-camera",  "volume-down",  "volume-off",  "volume-up",  "warning",  "wheelchair",  "wifi",  "wrench",  "hand-o-down",  "hand-o-left",  "hand-o-right",  "hand-o-up",  "ambulance",  "subway",  "train",  "genderless",  "intersex",  "mars",  "mars-double",  "mars-stroke",  "mars-stroke-h",  "mars-stroke-v",  "mercury",  "neuter",  "transgender",  "transgender-alt",  "venus",  "venus-double",  "venus-mars",  "file",  "file-o",  "file-text",  "file-text-o",  "info-circle lg li",  "cc-amex",  "cc-diners-club",  "cc-discover",  "cc-jcb",  "cc-mastercard",  "cc-paypal",  "cc-stripe",  "cc-visa",  "google-wallet",  "paypal",  "bitcoin",  "btc",  "cny",  "dollar",  "eur",  "euro",  "gbp",  "gg",  "gg-circle",  "ils",  "inr",  "jpy",  "krw",  "rmb",  "rouble",  "rub",  "ruble",  "rupee",  "shekel",  "sheqel",  "try",  "turkish-lira",  "usd",  "won",  "yen",  "align-center",  "align-justify",  "align-left",  "align-right",  "bold",  "chain",  "chain-broken",  "clipboard",  "columns",  "copy",  "cut",  "dedent",  "files-o",  "floppy-o",  "font",  "header",  "indent",  "italic",  "link",  "list",  "list-alt",  "list-ol",  "list-ul",  "outdent",  "paperclip",  "paragraph",  "paste",  "repeat",  "rotate-left",  "rotate-right",  "save",  "scissors",  "strikethrough",  "subscript",  "superscript",  "table",  "text-height",  "text-width",  "th",  "th-large",  "th-list",  "underline",  "undo",  "unlink",  "angle-double-down",  "angle-double-left",  "angle-double-right",  "angle-double-up",  "angle-down",  "angle-left",  "angle-right",  "angle-up",  "arrow-circle-down",  "arrow-circle-left",  "arrow-circle-o-down",  "arrow-circle-o-left",  "arrow-circle-o-right",  "arrow-circle-o-up",  "arrow-circle-right",  "arrow-circle-up",  "arrow-down",  "arrow-left",  "arrow-right",  "arrow-up",  "arrows-alt",  "caret-left",  "caret-right",  "caret-up",  "chevron-circle-down",  "chevron-circle-left",  "chevron-circle-right",  "chevron-circle-up",  "chevron-down",  "chevron-left",  "chevron-right",  "chevron-up",  "long-arrow-down",  "long-arrow-left",  "long-arrow-right",  "long-arrow-up",  "backward",  "compress",  "eject",  "expand",  "fast-backward",  "fast-forward",  "forward",  "pause",  "pause-circle",  "pause-circle-o",  "play",  "play-circle",  "play-circle-o",  "step-backward",  "step-forward",  "stop",  "stop-circle",  "stop-circle-o",  "youtube-play",  "500px",  "adn",  "amazon",  "android",  "angellist",  "apple",  "behance",  "behance-square",  "bitbucket",  "bitbucket-square",  "black-tie",  "buysellads",  "chrome",  "codepen",  "codiepie",  "connectdevelop",  "contao",  "css3",  "dashcube",  "delicious",  "deviantart",  "digg",  "dribbble",  "dropbox",  "drupal",  "edge",  "empire",  "expeditedssl",  "facebook",  "facebook-f",  "facebook-official",  "facebook-square",  "firefox",  "flickr",  "fonticons",  "fort-awesome",  "forumbee",  "foursquare",  "ge",  "get-pocket",  "git",  "git-square",  "github",  "github-alt",  "github-square",  "gittip",  "google",  "google-plus",  "google-plus-square",  "gratipay",  "hacker-news",  "houzz",  "html5",  "internet-explorer",  "ioxhost",  "joomla",  "jsfiddle",  "lastfm",  "lastfm-square",  "leanpub",  "linkedin",  "linkedin-square",  "linux",  "maxcdn",  "meanpath",  "medium",  "mixcloud",  "modx",  "odnoklassniki",  "odnoklassniki-square",  "opencart",  "openid",  "opera",  "optin-monster",  "pagelines",  "pied-piper-alt",  "pied-piper-pp",  "pinterest",  "pinterest-p",  "pinterest-square",  "product-hunt",  "qq",  "ra",  "rebel",  "reddit",  "reddit-alien",  "reddit-square",  "renren",  "resistance",  "safari",  "scribd",  "sellsy",  "shirtsinbulk",  "simplybuilt",  "skyatlas",  "skype",  "slack",  "slideshare",  "soundcloud",  "spotify",  "stack-exchange",  "stack-overflow",  "steam",  "steam-square",  "stumbleupon",  "stumbleupon-circle",  "tencent-weibo",  "trello",  "tripadvisor",  "tumblr",  "tumblr-square",  "twitch",  "twitter",  "twitter-square",  "usb",  "viacoin",  "vimeo",  "vimeo-square",  "vine",  "vk",  "wechat",  "weibo",  "weixin",  "whatsapp",  "wikipedia-w",  "windows",  "wordpress",  "xing",  "xing-square",  "y-combinator",  "y-combinator-square",  "yahoo",  "yc",  "yc-square",  "yelp",  "youtube",  "youtube-square",  "h-square",  "hospital-o",  "medkit",  "stethoscope",  "user-md"];
	$scope.icons = [];
	$scope.menu = menu;
	$scope.isLoading ={
        grid:false
	};
	
	$scope.sections = [];
    $scope.pages = [];
    $scope.menus = [];
   
	var sectionsManager = new entityManager(dasApp.apiBase + 'sections/', 'section_id', {data: 'results'});
    var pagesManager = new entityManager(dasApp.apiBase + 'pages/', 'page_id', {data: 'results'});
    var menusManager = new entityManager(dasApp.apiBase + 'menu/', 'menu_id', {data: 'results'});
	menusManager.loadAll(1,100).then(function (data) {
        $scope.menus = data.results;
    });
	
	sectionsManager.loadAll(1,100).then(function (data) {
        $scope.sections = data.results;
    });

	$scope.searchIcons = function(str){
		$scope.icons = $.grep($scope.allIcons,function(i,j){return i.indexOf(str) >=0; });
	};
	$scope.searchSections = function(str){
        return sectionsManager.search([ {
            field: 'sections.section_title_en',
            value: str,
            op: 'like'
        },{
            field: 'sections.section_title_ar',
            value: str,
            op: 'orlike'
        }]).then(function(data){$scope.sections = data.results;});
    };
	
	 if(options.isEdit == true)
	{
		 pagesManager.loadAll(1,100).then(function (data) {
        $scope.pages = data.results;
		 });
	}
	
   $scope.GetPages = function(section)
   {
	  
		return pagesManager.search([ {
            field: 'pages.section_id',
            value: section.section_id,
           
        }]).then(function(data){$scope.pages = data.results;});
		 
   }
	$scope.searchPages = function(str,section_id){
        return pagesManager.search([ {
            field: 'pages.section_id',
            value: section_id,
           
        },{
            field: 'pages.page_title_en',
            value: str,
            op: 'like'
        },{
            field: 'pages.page_title_ar',
            value: str,
            op: 'orlike'
        }]).then(function(data){$scope.pages = data.results;});
    };
	
	$scope.addItem = function () {
        if(!$scope.menu.menu_items)
            $scope.menu.menu_items = [];

        $scope.menu.menu_items.push({
            item_name_en: '',
            item_name_ar:'',
            link_type: '',
			link_value: '',
			item_sort: 1,
            $$is_editing : true
        });
    };

    $scope.editItem = function (item) {
        item.$$is_editing = true;
        item.$$clone = angular.copy(item);
    };

    $scope.saveItem = function (item) {
        item.$$is_editing = false;
        delete item.$$clone ;
    };

    $scope.cancelItem = function (item) {
        item.$$is_editing = false;
        angular.forEach(item.$$clone, function(i,j){
            if(j.startsWith('$$'))
                return;
            item[j] = i;
        });
        delete item.$$clone;
    };

    $scope.removeItem= function (item) {
        var index = $scope.menu.menu_items.indexOf(item);
        if(index >=0)
            $scope.menu.menu_items.splice(index, 1);
    };

    $scope.ok = function () {
		$scope.isLoading.grid = true;
	
        if(options.isEdit == true)
        {
			
            menuManager.update($scope.menu,$scope.menu.menu_id) .then(function(response){
				$scope.isLoading.grid = false;
				$scope.menu = save_copy($scope.menu);
           
                $uibModalInstance.close(response.data);
            },function(error){ //insert failed
                $scope.errors=error.errors;
				$scope.isLoading.grid = false;
	

            });
        }
        else
        {
            menuManager.add($scope.menu) .then(function(response){
				$scope.isLoading.grid = false;
				$scope.menu = save_copy($scope.menu);
           
                $uibModalInstance.close(response.data);
            },function(error){ //insert failed
                $scope.errors=error.errors;
				$scope.isLoading.grid = false;
	
                
            });
        }
    };
 
   
    $scope.itemSortUp = function(item){
		var index = $scope.menu.menu_items.indexOf(item);
		if(index == 0) return;
		var temp = $scope.menu.menu_items[index];
		$scope.menu.menu_items[index] = $scope.menu.menu_items[index-1]
		$scope.menu.menu_items[index-1] = temp;
		item.item_sort = index-1;
    }; 

    
    $scope.itemSortDown = function(item){
		
		var index = $scope.menu.menu_items.indexOf(item);
		if(index ==  $scope.menu.menu_items.length -1 ) return;
		var temp = $scope.menu.menu_items[index];
		$scope.menu.menu_items[index] = $scope.menu.menu_items[index+1]
		$scope.menu.menu_items[index+1] = temp;
		item.item_sort = index+1;
		

    };


    $scope.cancel = function (item) {
		$uibModalInstance.dismiss('cancel');
    };
	
	$scope.setSection = function (page,item)
	{
		item.section_id = page.section_id;
		
	}
	
	
}]);
