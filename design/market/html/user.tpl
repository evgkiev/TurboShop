{* User *}
<div class="row justify-content-center">
	<div class="col-md-12 col-lg-9 col-xl-8">

		{* Page Title *}
		<h1 class="mt-4">
			{* User Name *}
			{$user->name|escape}

			{* Logout *}
			<a href="{$lang_link}user/logout" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="{$lang->logout|escape}">
				<i class="fas fa-arrow-right-from-bracket"></i>
			</a>
		</h1>

		{* Discount *}
		<h5>
			{if $group && $group->discount > 0}
				{$lang->your_discount|escape} &mdash; {$group->discount}%
			{/if}
		</h5>

		{* Error *}
		{if $error}
			<div class="alert alert-danger" role="alert">
				{if $error == 'empty_name'}
					{$lang->enter_your_name|escape}
				{elseif $error == 'empty_email'}
					{$lang->enter_your_email|escape}
				{elseif $error == 'empty_password'}
					{$lang->enter_password|escape}
				{elseif $error == 'user_exists'}
					{$lang->email_already_registered|escape}
				{else}
					{$error}
				{/if}
			</div>
		{/if}

		{* Success *}
		{if $success}
			<div class="alert alert-success" role="alert">
				{$lang->message_success|escape}
			</div>
		{/if}

		<div class="col-md-6 offset-md-3">
			<form class="form-horizontal needs-validation mt-4" role="form" method="post" novalidate>
				<div class="mb-3">
					<label for="name" class="form-label">{$lang->name|escape}<span class="text-danger">*</span></label>
					<input type="text" class="form-control" name="name" id="name" value="{$name|escape}" placeholder="{$lang->enter_your_name|escape}" maxlength="255" required>
					<div class="invalid-feedback">{$lang->enter_your_name|escape}</div>
				</div>
				<div class="mb-3">
					<label for="email" class="form-label">Email<span class="text-danger">*</span></label>
					<input type="text" class="form-control" name="email" id="email" value="{$email|escape}" placeholder="{$lang->enter_your_email|escape}" maxlength="255" required>
					<div class="invalid-feedback">{$lang->enter_your_email|escape}</div>
				</div>
				<div class="mb-3">
					<label for="phone" class="form-label">{$lang->phone|escape}</label>
					<input type="text" class="form-control" name="phone" id="phone" value="{$phone|escape}" placeholder="{$lang->enter_phone_number|escape}" maxlength="255">
				</div>
				<div class="mb-3">
					<label for="address" class="form-label">{$lang->address|escape}</label>
					<input type="text" class="form-control" name="address" id="address" value="{$address|escape}" placeholder="{$lang->enter_the_address|escape}" maxlength="255">
				</div>
				<div class="mb-3">
					<label for="password" class="form-label">
						<a class="text-decoration-none" data-bs-toggle="collapse" href="#collapsePassword" role="button" aria-expanded="false" aria-controls="collapsePassword">{$lang->change_password|escape}</a>
					</label>
					<div class="collapse" id="collapsePassword">
						<input type="password" class="form-control" name="password" id="password" value="">
					</div>
				</div>
				<div class="mt-3">
					<div class="col-sm-offset-2">
						<input type="submit" class="btn btn-primary" value="{$lang->save|escape}">
					</div>
				</div>
			</form>
		</div>

		{* Orders *}
		{if $orders}
			<h4 class="mt-5">{$lang->your_orders|escape}</h4>
			<div class="table-responsive">
				<table class="table m-0">
					<thead>
						<tr>
							<th class="text-nowrap">{$lang->global_date|escape}</th>
							<th class="text-nowrap">{$lang->global_order|escape}</th>
							<th class="text-nowrap">{$lang->status|escape}</th>
							<th class="text-nowrap">{$lang->global_payment|escape}</th>
						</tr>
					</thead>
					<tbody>
						{foreach $orders as $order}
							<tr>
								<td class="text-nowrap">{$order->date|date}</td>
								<td class="text-nowrap">
									<a href='{$lang_link}order/{$order->url}'>
										{$lang->global_order|escape}{$order->id}
									</a>
								</td>
								<td class="text-nowrap">
									{if $order->status == 0}
										{$lang->waiting_processing|escape}
									{elseif $order->status == 1}
										{$lang->in_processing|escape}
									{elseif $order->status == 2}
										{$lang->completed|escape}
									{/if}
								</td>
								<td class="text-nowrap">
									{if $order->paid == 1}
										<span class="text-success">{$lang->paid|escape}</span>
									{else}
										<span class="text-danger">{$lang->not_paid|escape}</span>
									{/if}
								</td>
							</tr>
						{/foreach}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>