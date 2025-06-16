
CREATE OR REPLACE FUNCTION get_posts_by_tag(p_tag_id UUID)
RETURNS SETOF posts AS $$
BEGIN
  RETURN QUERY
  SELECT p.*
  FROM posts p
  JOIN post_tags pt ON p.id = pt.post_id
  WHERE pt.tag_id = p_tag_id AND p.is_published = true;
END;
$$ LANGUAGE plpgsql;
