$ ->
	pathname = document.location.pathname

	target = pathname.split("/")[1];
	console.log target
	if(target == "" || target == "test")
		index = 0
	else if (target == "signup")
		index  = 2
	else if(target == "signin") 
		index = 1

	if(index != undefined)
		nav = $("#header").find(".nav").find("li").removeClass("active");
		$(nav[index]).addClass("active");

	$('#logout').on 'click', ->
		$.ajax({
			type: 'post'
			url: '/signout',
		})