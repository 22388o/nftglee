CREATE
OR REPLACE VIEW "public"."activeartworks" AS
select a1.*
from artworks a1 
join (
    select edition_id, min(edition) as edition
    from artworks 
    where transferred_at is null 
    group by edition_id
) a2 
on (
    a1.edition_id = a2.edition_id
    and a1.edition = a2.edition
) or (
    a1.transferred_at is not null 
)
where a1.asking_asset is not null;
