(function ($, document, LibraryBrowser, window) {

	var currentItem;

    function reload(page) {

        var id = getParameterByName('id');

        Dashboard.showLoadingMsg();

        ApiClient.getItem(Dashboard.getCurrentUserId(), id).done(function (item) {

	        currentItem = item;

	        var name = item.Name;

            $('#itemImage', page).html(LibraryBrowser.getDetailImageHtml(item));

            Dashboard.setPageTitle(name);

            $('#itemName', page).html(name);

	        setInitialCollapsibleState(page, item);
            renderDetails(page, item);

            Dashboard.hideLoadingMsg();
        });
    }

	function setInitialCollapsibleState(page, item) {

		if (!item.People || !item.People.length) {
			$('#castCollapsible', page).hide();
		} else {
			$('#castCollapsible', page).show();
		}
	}

    function renderDetails(page, item) {
        
        if (item.Taglines && item.Taglines.length) {
            $('#itemTagline', page).html(item.Taglines[0]).show();
        } else {
            $('#itemTagline', page).hide();
        }

        if (item.Overview || item.OverviewHtml) {
            var overview = item.OverviewHtml || item.Overview;

            $('#itemOverview', page).html(overview).show();
            $('#itemOverview a').each(function () {
                $(this).attr("target", "_blank");
            });
        } else {
            $('#itemOverview', page).hide();
        }

        if (item.CommunityRating) {
            $('#itemCommunityRating', page).html(LibraryBrowser.getStarRatingHtml(item)).show().attr('title', item.CommunityRating);
        } else {
            $('#itemCommunityRating', page).hide();
        }

        $('#itemMiscInfo', page).html(LibraryBrowser.getMiscInfoHtml(item));

        LibraryBrowser.renderGenres($('#itemGenres', page), item);
        LibraryBrowser.renderStudios($('#itemStudios', page), item);
        renderUserDataIcons(page, item);
        LibraryBrowser.renderLinks($('#itemLinks', page), item);
    }
    
    function renderUserDataIcons(page, item) {
        $('#itemRatings', page).html(LibraryBrowser.getUserDataIconsHtml(item));
    }

	function renderGallery(page, item) {

		var imageTags = item.ImageTags || {};
		var html = '';
		var i, length;

		if (imageTags.Logo) {

			html += LibraryBrowser.createGalleryImage(item.Id, "Logo", item.ImageTags.Logo);
		}
		if (imageTags.Thumb) {

			html += LibraryBrowser.createGalleryImage(item.Id, "Thumb", item.ImageTags.Thumb);
		}
		if (imageTags.Art) {

			html += LibraryBrowser.createGalleryImage(item.Id, "Art", item.ImageTags.Art);

		}
		if (imageTags.Menu) {

			html += LibraryBrowser.createGalleryImage(item.Id, "Menu", item.ImageTags.Menu);

		}
		if (imageTags.Disc) {

			html += LibraryBrowser.createGalleryImage(item.Id, "Disc", item.ImageTags.Disc);
		}
		if (imageTags.Box) {

			html += LibraryBrowser.createGalleryImage(item.Id, "Box", item.ImageTags.Box);
		}

		if (item.BackdropImageTags) {

			for (i = 0, length = item.BackdropImageTags.length; i < length; i++) {
				html += LibraryBrowser.createGalleryImage(item.Id, "Backdrop", item.BackdropImageTags[0], i);
			}

		}

		if (item.ScreenshotImageTags) {

			for (i = 0, length = item.ScreenshotImageTags.length; i < length; i++) {
				html += LibraryBrowser.createGalleryImage(item.Id, "Screenshot", item.ScreenshotImageTags[0], i);
			}
		}

		$('#galleryContent', page).html(html).trigger('create');
	}

	function renderCast(page, item) {
		var html = '';

		var casts = item.People || [];

		for (var i = 0, length = casts.length; i < length; i++) {

			var cast = casts[i];

			html += LibraryBrowser.createCastImage(cast);
		}

		$('#castContent', page).html(html);
	}

	$(document).on('pageinit', "#tvSeriesPage", function () {

		var page = this;

	}).on('pageshow', "#tvSeriesPage", function () {

		var page = this;

		reload(page);

		$('#castCollapsible', page).on('expand.lazyload', function () {
			renderCast(page, currentItem);

			$(this).off('expand.lazyload');
		});

		$('#galleryCollapsible', page).on('expand.lazyload', function () {

			renderGallery(page, currentItem);

			$(this).off('expand.lazyload');
		});

	}).on('pagehide', "#tvSeriesPage", function () {

		currentItem = null;
		var page = this;

		$('#castCollapsible', page).off('expand.lazyload');
		$('#galleryCollapsible', page).off('expand.lazyload');
	});

	function tvSeriesPage() {

		var self = this;

	}

	window.TvSeriesPage = new tvSeriesPage();

})(jQuery, document, LibraryBrowser, window);