<script>
	export let message = 'Default message';
	export let redirect = '';
</script>

<div class="absolute top-0 h-full w-full bg-slate-900 opacity-25 overflow-hidden" />
<div class="absolute top-0 flex h-full w-full items-center justify-center overflow-hidden">
	<div class="flex h-1/4 w-fit px-10 py-3 items-center justify-evenly bg-slate-100 flex-col rounded-xl gap-5  ">
		<h2>{message}</h2>

		<a href={redirect}>
			<div class="flex h-10 w-fit px-4 items-center justify-center rounded-xl bg-slate-800 text-white">
				<p>OK</p>
			</div>
		</a>
	</div>
</div>
