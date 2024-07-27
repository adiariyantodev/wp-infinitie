<?php

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

//for some hostings who filter: disable output buffering - introduced in 5.0.3
if (ob_get_status()) ob_end_clean(); 

$csshero_version="5";
$csshero_version_styles="5";
$theme_slug=csshero_get_active_theme_slug();
//$html_theme_slug = $theme_slug;
//$rocket_mode_string="";
if (is_child_theme()) $theme_slug=strtolower(get_template()); //gets the parent if we are using a child

//you can force here to override default configuration being applied to your theme | EXAMPLE: $theme_slug="yourtheme";
if (isset($_GET['override_theme_config'])) $theme_slug=sanitize_title($_GET['override_theme_config']);

//for the online demos
if (function_exists("csshero_demo_plugin_is_active")) $is_demo_additional_par="cache_subject=demo&"; else $is_demo_additional_par="";

$site_base_url = site_url().'/';
$plugin_root_url= plugin_dir_url( __FILE__ );
 
?>
<!DOCTYPE html>
<html data-child-theme-slug="<?php echo $theme_slug; ?>">
<head>
	<meta charset="UTF-8">
	<meta name="robots" content="noindex,nofollow">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
	<title>CSS Hero &mdash; <?php echo $csshero_version; ?></title>
	<link rel="stylesheet" href="<?php echo $plugin_root_url ?>dist/main.css"/>
</head>
<body id="csshero-body" data-js-version="<?php echo $csshero_version;?>" data-css-version="<?php echo $csshero_version_styles; ?>">
<div id="root"></div>
<textarea hidden id='cssheroSaveData'>
    <?php echo ((csshero_get_data())); //addslashes ?>
</textarea>

<textarea hidden id='cssheroSBlist'>
    {
    "Home":{
        "Home":"<?php bloginfo('url'); ?>"
    },
    <?php 
    csshero_print_post_urls();
    ?>
    
    "Templates":{
        "Search":"<?php echo get_search_link('search'); ?>",
        "Login page":"<?php bloginfo('url');?>/?csshero_style_wp_login_page=1"
    }
    }
</textarea>
</body>
<noscript>You need to enable JavaScript to run this app.</noscript>
<script>
window.LoadHEROWorker = new Worker('<?php echo $plugin_root_url ?>dist/worker.js');
window.baseUrl = '<?php echo $site_base_url; ?>';
window.adminAjaxUrl = '<?php echo admin_url( 'admin-ajax.php' ); ?>';
window.nonce = '<?php echo wp_create_nonce( "csshero-saving" ) ?>';


window.getPath = function(el) {
    el = $(el);
    var pathes = [];
    el.each(function(index, element) {
        var path, $node = jQuery(element);
        while ($node.length) {
            var realNode = $node.get(0), name = realNode.localName;
            if (!name) { break; }
            name = name.toLowerCase();
            
            var parent = $node.parent();
            var sameTagSiblings = parent.children(name);

            if (sameTagSiblings.length > 1){
                allSiblings = parent.children();
                var index = allSiblings.index(realNode) +1;
                if (index > 0) {
                    name += ':nth-child(' + index + ')';
                }
            }
            
            // FIND IF IT'S A POST OR PAGE
            
            classes = jQuery(realNode).attr('class');
            
            if (jQuery(realNode).attr('id')){
                name = '#'+jQuery(realNode).attr('id');
            } else {
            
                if(classes && classes.indexOf('post-')>-1){
	                classes_arr = classes.split(' ');
	                single_post_class =  jQuery.grep(classes_arr, function( a ) {
						return  a.indexOf('post-') == 0;
					});
					if (single_post_class.length > 0){
						name = '.'+single_post_class.join('.');
					}
				}
			}
			
			
			
			path = name + (path ? ' > ' + path : '');
			$node = parent;
		}
					
		pathes.push(path);
    });
    const joined = pathes.join(',')
    let ret = joined;
    if (joined.indexOf('#')>-1){
        ret = joined.split('#')
        ret = '#'+ret[ret.length -1]
    }


    return ret;
}

</script>
<script data-cfasync="false" type="text/javascript" src="https://code.jquery.com/jquery-3.6.0.slim.js" integrity="sha256-HwWONEZrpuoh951cQD1ov2HUK5zA5DwJ1DNUXaM6FsY=" crossorigin="anonymous"></script>
<script type="text/javascript" src='<?php echo $plugin_root_url ?>csshero.js'></script>> 
<script src="<?php echo $plugin_root_url ?>dist/main.js"></script>
</html>