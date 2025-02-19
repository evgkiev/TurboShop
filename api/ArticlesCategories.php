<?php

require_once 'Turbo.php';

class ArticlesCategories extends Turbo
{
	private $allArticlesCategories;
	private $articlesCategoriesTree;

	/**
	 * Get Articles Categories
	 */
	public function getArticlesCategories()
	{
		if (!isset($this->articlesCategoriesTree)) {
			$this->initArticlesCategories();
		}

		return $this->allArticlesCategories;
	}

	/**
	 * Get Articles Categories Tree
	 */
	public function getArticlesCategoriesTree()
	{
		if (!isset($this->articlesCategoriesTree)) {
			$this->initArticlesCategories();
		}

		return $this->articlesCategoriesTree;
	}

	/**
	 * Get Article Category
	 */
	public function getArticlesCategory($id)
	{
		if (!isset($this->allArticlesCategories)) {
			$this->initArticlesCategories();
		}

		if (is_int($id) && array_key_exists((int)$id, $this->allArticlesCategories)) {
			return $this->allArticlesCategories[(int)$id];
		} elseif (is_string($id)) {
			foreach ($this->allArticlesCategories as $category) {
				if (isset($category->url) && $category->url == $id) {
					return $this->getArticlesCategory((int)$category->id);
				}
			}
		}

		return false;
	}

	/**
	 * Add Articles Category
	 */
	public function addArticlesCategory($category)
	{
		if (!is_array($category)) {
			$category = (array) $category;
		}

		if (empty($category['url'])) {
			$category['url'] = preg_replace("/[\s]+/ui", '_', $category['name']);
			$category['url'] = strtolower(preg_replace("/[^0-9a-zа-я_]+/ui", '', $category['url']));
		}

		while ($this->getArticlesCategory((string) $category['url'])) {
			if (preg_match('/(.+)_([0-9]+)$/', $category['url'], $parts)) {
				$category['url'] = $parts[1] . '_' . ($parts[2] + 1);
			} else {
				$category['url'] = $category['url'] . '_2';
			}
		}

		$category = (object) $category;

		$result = $this->languages->getDescription($category, 'article_category');

		if (!empty($result->data)) {
			$category = $result->data;
		}

		$this->db->query("INSERT INTO __articles_categories SET ?%", $category);

		$id = $this->db->insertId();

		$this->db->query("UPDATE __articles_categories SET position=id WHERE id=?", $id);

		if (!empty($result->description)) {
			$this->languages->actionDescription($id, $result->description, 'article_category');
		}

		unset($this->articlesCategoriesTree);
		unset($this->allArticlesCategories);

		return (int) $id;
	}

	/**
	 * Update Articles Category
	 */
	public function updateArticlesCategory($id, $category)
	{
		if (!is_array($category)) {
			$category = (array) $category;
		}

		$category = (object) $category;

		$result = $this->languages->getDescription($category, 'article_category');

		if (!empty($result->data)) {
			$category = $result->data;
		}

		$query = $this->db->placehold("UPDATE __articles_categories SET last_modified=NOW(), ?% WHERE id=? LIMIT 1", $category, (int) $id);
		$this->db->query($query);

		if (!empty($result->description)) {
			$this->languages->actionDescription($id, $result->description, 'article_category', $this->languages->langId());
		}

		unset($this->articlesCategoriesTree);
		unset($this->allArticlesCategories);

		return (int) $id;
	}

	/**
	 * Delete Articles Category
	 */
	public function deleteArticlesCategory($id)
	{
		$category = $this->getArticlesCategory((int) $id);

		if (!$category) {
			return false;
		}

		foreach ($category->children as $childId) {
			if (!empty($childId)) {
				$this->deleteImage($childId);

				$query = $this->db->placehold("DELETE FROM __articles_categories WHERE id=? LIMIT 1", $childId);
				$this->db->query($query);

				$this->initArticlesCategories();

				$this->db->query("DELETE FROM __lang_articles_categories WHERE article_category_id=?", $childId);
				$this->db->query($query);
			}
		}

		return true;
	}

	/**
	 * Delete Image
	 */
	public function deleteImage($categoriesIds)
	{
		$categoriesIds = (array) $categoriesIds;
		$query = $this->db->placehold("SELECT image FROM __articles_categories WHERE id IN(?@)", $categoriesIds);

		if ($this->db->query($query)) {
			$filenames = $this->db->results('image');
		}

		if (!empty($filenames)) {
			$query = $this->db->placehold("UPDATE __articles_categories SET image=NULL WHERE id IN(?@)", $categoriesIds);
			$this->db->query($query);

			foreach ($filenames as $filename) {
				$query = $this->db->placehold("SELECT count(*) AS count FROM __articles_categories WHERE image=?", $filename);
				$this->db->query($query);

				$count = $this->db->result('count');

				if ($count == 0) {
					$file = pathinfo($filename, PATHINFO_FILENAME);
					$ext = pathinfo($filename, PATHINFO_EXTENSION);
					$webp = 'webp';

					$resizedImages = glob($this->config->root_dir . $this->config->resized_category_images_dir . $file . "*." . $ext);

					if (is_array($resizedImages)) {
						foreach ($resizedImages as $f) {
							if (is_file($f)) {
								@unlink($f);
							}
						}
					}

					$resizedImages = glob($this->config->root_dir . $this->config->resized_category_images_dir . $file . "*." . $webp);

					if (is_array($resizedImages)) {
						foreach ($resizedImages as $f) {
							if (is_file($f)) {
								@unlink($f);
							}
						}
					}

					@unlink($this->config->root_dir . $this->config->categories_images_dir . $filename);
				}
			}

			unset($this->initArticlesCategories);
		}
	}

	/**
	 * Initializes Articles Categories
	 */
	private function initArticlesCategories()
	{
		$tree = new stdClass();
		$tree->subcategories = [];

		$pointers = [];
		$pointers[0] = &$tree;
		$pointers[0]->path = [];
		$pointers[0]->level = 0;

		$langSql = $this->languages->getQuery(['object' => 'article_category', 'px' => 'c']);

		$query = $this->db->placehold(
			"SELECT 
				c.id, 
				c.parent_id, 
				c.name, 
				c.name_h1, 
				c.description, 
				c.url, 
				c.meta_title, 
				c.meta_keywords, 
				c.meta_description, 
				c.image, 
				c.visible, 
				c.position, 
				c.last_modified, 
				$langSql->fields 
			FROM __articles_categories c 
				$langSql->join 
			ORDER BY c.parent_id, c.position"
		);

		if ($this->settings->cached == 1 && empty($_SESSION['admin'])) {
			if ($result = $this->cache->get($query)) {
				$articlesCategories = $result;
			} else {
				$this->db->query($query);
				$result = $this->db->results();

				$this->cache->set($query, $result);
				$articlesCategories = $result;
			}
		} else {
			$this->db->query($query);
			$articlesCategories = $this->db->results();
		}

		foreach ($articlesCategories as $category) {
			if (!isset($category->subcategories)) {
				$category->subcategories = [];
			}

			$pointers[$category->id] = $category;

			if (isset($pointers[$category->parent_id])) {
				$pointers[$category->parent_id]->subcategories[] = $category;
				$category->path = $pointers[$category->parent_id]->path;
				$category->path[] = $category;
				$category->level = $pointers[$category->parent_id]->level + 1;
			} else {
				$tree->subcategories[] = $category;
				$category->path = [];
				$category->level = 0;
			}
		}

		foreach (array_reverse(array_keys($pointers)) as $id) {
			if ($id > 0) {
				$category = $pointers[$id];
				$category->children[] = $id;

				$parent_id = $category->parent_id;
				if ($parent_id && isset($pointers[$parent_id])) {
					$pointers[$parent_id]->children = array_merge(
						$category->children,
						$pointers[$parent_id]->children ?? []
					);
				}
			}
		}

		$this->articlesCategoriesTree = $tree->subcategories;
		$this->allArticlesCategories = $pointers;
	}
}
