/*

Auteurs : Laurent BRACQUART <lbracquart@atalan.fr>, SÃ©bastien DELORME <sdelorme@atalan.fr>
URL : http://atalan.fr/
Date de crÃ©ation : 05 Juillet 2011
Datet de mise Ã  jour : 08 mars 2013
Version : 1.1

Index :

    0/ Masquage des panneaux par dÃ©faut
    1/ Initialisation des liens d'accÃ¨s aux panneaux
	2/ Gestion de l'affichage des panneaux

    Annexes/ Fonctions annexes

*/

$(document).ready(function()
{
	// 0/ Masquage des panneaux par dÃ©faut
	$panneaux = $('div.testimonial-proprietes').hide();
	
	// ---------------------------------------------------------------------------------------- //
	
	// 1/ Initialisation des liens d'accÃ¨s aux panneaux
	
	$('h3.titre3').each(function(i)
	{
		$this = $(this);
		ancre = $this.next($panneaux)[0].id;
		
		lien = $('<a>',
		{
			'href':				'#' + ancre,
			'aria-expanded':	'false',
			'aria-controls':	ancre
		});
		
		$this.wrapInner(lien);
	});
	
	// ---------------------------------------------------------------------------------------- //

    // 2/ Gestion de l'affichage des panneaux
	$('h3.titre3 > a').click(function() 
	{
		if ($(this).attr('aria-expanded') == 'false') 
		{
            $(this).attr('aria-expanded', true).parent().next($panneaux).show();
		} 
		else 
		{
            $(this).attr('aria-expanded', false).parent().next($panneaux).hide();
		}
		return false;
	}); 
});
