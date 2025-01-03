<div class="header-compare js-compare-block-wrapper">
	{if $compare_products > 0}
		<a class="compare-link dark_link light-opacity-hover fill-theme-hover fill-dark-light-block color-theme-hover banner-light-icon-fill flexbox flexbox--direction-column flexbox--align-center" href="{$lang_link}compare/" title="{$lang->compare|escape}">
			<span class="compare-block icon-block-with-counter menu-light-icon-fill fill-use-888 fill-theme-use-svg-hover">
				<span class="js-compare-block icon-block-with-counter--count">
					<span class="icon-count icon-count--compare bg-more-theme count">{$compare_products}</span>
				</span>
				<i class="svg inline compare header__icon" aria-hidden="true">
					<svg width="20" height="16">
						<use xlink:href="design/{$settings->theme|escape}/images/svg/catalog/item_icons.svg#compare-20-16"></use>
					</svg>
				</i>
			</span>
			<span class="header__icon-name title menu-light-text banner-light-text">{$lang->compare|escape}</span>
		</a>
	{else}
		<a class="compare-link dark_link light-opacity-hover fill-theme-hover fill-dark-light-block color-theme-hover banner-light-icon-fill flexbox flexbox--direction-column flexbox--align-center" href="{$lang_link}compare/" title="{$lang->compare|escape}">
			<span class="compare-block icon-block-with-counter menu-light-icon-fill fill-use-888 fill-theme-use-svg-hover">
				<span class="js-compare-block">
					<span class="icon-count icon-count--compare bg-more-theme count">0</span>
				</span>
				<i class="svg inline compare header__icon" aria-hidden="true">
					<svg width="20" height="16">
						<use xlink:href="design/{$settings->theme|escape}/images/svg/catalog/item_icons.svg#compare-20-16"></use>
					</svg>
				</i>
			</span>
			<span class="header__icon-name title menu-light-text banner-light-text">{$lang->compare|escape}</span>
		</a>
	{/if}
</div>