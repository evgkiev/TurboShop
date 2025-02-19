{* Slider *}
{get_banner var=banner_1 group='1'}
{if $banner_1 && $banner_1->items}
	<div id="MainSlider" class="carousel slide my-4 {if isset($smarty.cookies.mode) && $smarty.cookies.mode == 'mode'}bg-body-emphasis{else}bg-body-emphasis carousel-dark{/if} rounded" data-bs-ride="carousel">
		<div class="carousel-indicators">
			{foreach $banner_1->items as $s name=indicator}
				<button type="button" data-bs-target="#MainSlider" data-bs-slide-to="{$smarty.foreach.indicator.index}" aria-label="Slide {$smarty.foreach.indicator.index}" {if $smarty.foreach.indicator.first}class="active" aria-current="true"{/if}></button>
			{/foreach}
		</div>
		<div class="carousel-inner">
			{foreach $banner_1->items as $s name=foo}
				<div class="carousel-item rounded {if $smarty.foreach.foo.first}active{/if} {if $s->style}text-{$s->style}{/if}" {if $s->color}style="background-color: {$s->color}"{/if}>
					<div class="row align-items-center py-3">
						<div class="col-md-5 ps-md-5 {if $s->side == 'right'}order-2{/if}">
							<div class="{if $s->side == 'right'}pe-md-5 text-md-start{else}ps-md-5 text-md-start{/if} ps-3 pe-3 pe-md-0 pt-4 pt-lg-5 pb-5 text-center">
								{if $s->name}<h3 class="mb-1">{$s->name|escape}</h3>{/if}
								{if $s->description}<h4 class="font-weight-light opacity-70 pb-3">{$s->description}</h4>{/if}
								{if $s->url}<a class="btn {if $s->code}btn-{$s->code}{else}btn-primary{/if}" href="{$lang_link}{$s->url|escape}">{$s->button|escape}<i class="fal fa-arrow-right ms-2"></i></a>{/if}
							</div>
						</div>
						<div class="col-md-7 {if $s->side == 'right'}order-1{/if}"><img class="d-block mx-auto" src="{$s->image|resize_banners:550:440}" alt="{$s->alt|escape}" title="{$s->title|escape}"></div>
					</div>
				</div>
			{/foreach}
		</div>
		<div class="d-none d-md-block">
			<button class="carousel-control-prev" type="button" data-bs-target="#MainSlider" data-bs-slide="prev">
				<span class="carousel-control-prev-icon" aria-hidden="true"></span>
				<span class="visually-hidden">Previous</span>
			</button>
			<button class="carousel-control-next" type="button" data-bs-target="#MainSlider" data-bs-slide="next">
				<span class="carousel-control-next-icon" aria-hidden="true"></span>
				<span class="visually-hidden">Next</span>
			</button>
		</div>
	</div>
{/if}