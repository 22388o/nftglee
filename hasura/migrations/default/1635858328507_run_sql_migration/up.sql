CREATE OR REPLACE FUNCTION public.artwork_bid(artwork_row artworks)
 RETURNS activebids
 LANGUAGE sql
 STABLE
AS $function$
    SELECT activebids.*
    FROM activebids
    JOIN artworks ON activebids.artwork_id = artworks.id
    WHERE activebids.artwork_id = artwork_row.id
    ORDER BY amount DESC
    LIMIT 1
$function$;
