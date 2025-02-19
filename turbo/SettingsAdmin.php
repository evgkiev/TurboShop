<?php

require_once 'api/Turbo.php';

class SettingsAdmin extends Turbo
{
	private $allowedImageExtensions = ['png'];

	public function fetch()
	{
		$managers = $this->managers->getManagers();
		$this->design->assign('managers', $managers);

		if ($this->request->method('post')) {
			if ($this->request->post('clear_cache')) {
				$this->cache->clearAll();
				$this->design->assign('message_success', 'cache_cleared');
			} else {
				$this->settings->update('site_name', $this->request->post('site_name'));
				$this->settings->update('company_name', $this->request->post('company_name'));
				$this->settings->date_format = $this->request->post('date_format');
				$this->settings->admin_email = $this->request->post('admin_email');
				$this->settings->admintooltip = $this->request->post('admintooltip');
				$this->settings->site_work = $this->request->post('site_work');
				$this->settings->admin_theme = $this->request->post('admin_theme');
				$this->settings->sidebar = $this->request->post('sidebar');
				$this->settings->layout = $this->request->post('layout');
				$this->settings->position = $this->request->post('position');
				$this->settings->captcha_product = $this->request->post('captcha_product', 'boolean');
				$this->settings->captcha_post = $this->request->post('captcha_post', 'boolean');
				$this->settings->captcha_cart = $this->request->post('captcha_cart', 'boolean');
				$this->settings->captcha_article = $this->request->post('captcha_article', 'boolean');
				$this->settings->captcha_register  = $this->request->post('captcha_register', 'boolean');
				$this->settings->captcha_feedback  = $this->request->post('captcha_feedback', 'boolean');
				$this->settings->captcha_callback  = $this->request->post('captcha_callback', 'boolean');
				$this->settings->captcha_fastorder = $this->request->post('captcha_fastorder', 'boolean');
				$this->settings->captcha_review = $this->request->post('captcha_review', 'boolean');
				$this->settings->order_email = $this->request->post('order_email');
				$this->settings->comment_email = $this->request->post('comment_email');
				$this->settings->notify_from_email = $this->request->post('notify_from_email');
				$this->settings->update('notify_from_name', $this->request->post('notify_from_name'));
				$this->settings->email_lang = $this->request->post('email_lang');
				$this->settings->use_smtp = $this->request->post('use_smtp');
				$this->settings->smtp_server = $this->request->post('smtp_server');
				$this->settings->smtp_port = $this->request->post('smtp_port');
				$this->settings->smtp_user = $this->request->post('smtp_user');
				$this->settings->smtp_pass = $this->request->post('smtp_pass');
				$this->settings->tg_notify = $this->request->post('tg_notify', 'boolean');
				$this->settings->tg_token = $this->request->post('tg_token');
				$this->settings->tg_apiurl = $this->request->post('tg_apiurl');
				$this->settings->tg_channel = $this->request->post('tg_channel');
				$this->settings->gpt_key = $this->request->post('gpt_key');
				$this->settings->model = $this->request->post('model');
				$this->settings->max_tokens = $this->request->post('max_tokens');
				$this->settings->temperature = $this->request->post('temperature');
				$this->settings->decimals_point = $this->request->post('decimals_point');
				$this->settings->thousands_separator = $this->request->post('thousands_separator');
				$this->settings->products_num = $this->request->post('products_num');
				$this->settings->products_num_admin = $this->request->post('products_num_admin');
				$this->settings->features_num_admin = $this->request->post('features_num_admin');
				$this->settings->brands_num = $this->request->post('brands_num');
				$this->settings->brands_num_admin = $this->request->post('brands_num_admin');
				$this->settings->faq_num = $this->request->post('faq_num');
				$this->settings->faq_num_admin = $this->request->post('faq_num_admin');
				$this->settings->max_order_amount = $this->request->post('max_order_amount');
				$this->settings->update('weight_units', $this->request->post('weight_units'));
				$this->settings->update('units', $this->request->post('units'));
				$this->settings->lang = $this->request->post('manager_lang');
				$this->settings->articles_num = $this->request->post('articles_num');
				$this->settings->articles_num_admin = $this->request->post('articles_num_admin');
				$this->settings->blog_num = $this->request->post('blog_num');
				$this->settings->blog_num_admin = $this->request->post('blog_num_admin');
				$this->settings->comments_num = $this->request->post('comments_num');
				$this->settings->comments_num_admin = $this->request->post('comments_num_admin');
				$this->settings->smart_resize = $this->request->post('smart_resize', 'boolean');
				$this->settings->webp_support = $this->request->post('webp_support', 'boolean');
				$this->settings->chat_viber = $this->request->post('chat_viber');
				$this->settings->chat_whats_app = $this->request->post('chat_whats_app');
				$this->settings->chat_telegram = $this->request->post('chat_telegram');
				$this->settings->chat_facebook = $this->request->post('chat_facebook');
				$this->settings->cached = $this->request->post('cached');
				$this->settings->cache_type = $this->request->post('cache_type');
				$this->settings->cache_time = $this->request->post('cache_time');
				$this->settings->image_quality = $this->request->post('image_quality');

				if ($this->request->post('category_count') == 1) {
					$this->settings->category_count = 1;
				} else {
					$this->settings->category_count = 0;
				}

				$clearImageCache = false;
				$this->settings->watermark_enable = $this->request->post('watermark_enable', 'boolean');
				$watermark = $this->request->files('watermark_file', 'tmp_name');

				if (!empty($watermark) && in_array(pathinfo($this->request->files('watermark_file', 'name'), PATHINFO_EXTENSION), $this->allowedImageExtensions)) {
					$uploaded = move_uploaded_file($watermark, $this->config->root_dir . $this->config->watermark_file);

					if ($uploaded) {
						$clearImageCache = true;
					} else {
						$this->design->assign('message_error', 'watermark_is_not_writable');
					}
				}

				if ($this->settings->watermark_offset_x != $this->request->post('watermark_offset_x')) {
					$this->settings->watermark_offset_x = $this->request->post('watermark_offset_x');
					$clearImageCache = true;
				}

				if ($this->settings->watermark_offset_y != $this->request->post('watermark_offset_y')) {
					$this->settings->watermark_offset_y = $this->request->post('watermark_offset_y');
					$clearImageCache = true;
				}

				if ($this->settings->watermark_transparency != $this->request->post('watermark_transparency')) {
					$this->settings->watermark_transparency = $this->request->post('watermark_transparency');
					$clearImageCache = true;
				}

				if ($this->settings->images_sharpen != $this->request->post('images_sharpen')) {
					$this->settings->images_sharpen = $this->request->post('images_sharpen');
					$clearImageCache = true;
				}

				if ($clearImageCache) {
					$dir = $this->config->resized_images_dir;

					if ($handle = opendir($dir)) {
						while (false !== ($file = readdir($handle))) {
							if ($file != '.' && $file != '..') {
								@unlink($dir . '/' . $file);
							}
						}

						closedir($handle);
					}
				}

				$this->design->assign('message_success', 'saved');
			}
		}

		$backendTranslations = $this->backendTranslations;
		$file = "turbo/lang/" . $this->settings->lang . ".php";

		if (!file_exists($file)) {
			foreach (glob("turbo/lang/??.php") as $f) {
				$file = "turbo/lang/" . pathinfo($f, PATHINFO_FILENAME) . ".php";
				break;
			}
		}

		require_once($file);

		$btrLanguages = [];

		foreach ($this->languages->langList() as $label => $l) {
			if (file_exists('turbo/lang/' . $label . '.php')) {
				$btrLanguages[$l->name] = $l->label;
			}
		}

		$this->design->assign('btr_languages', $btrLanguages);
		$this->design->assign('btr', $backendTranslations);

		return $this->design->fetch('settings.tpl');
	}
}
