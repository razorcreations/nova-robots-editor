

<template>
  <div>
    <heading class="mb-6">
      Robots.txt Editor
    </heading>
    <textarea
      v-model="contents"
      class="w-full h-64 py-3 my-3 form-control form-input form-input-bordered"
      style="min-height: 60vh"
    />
	<p v-if="updatedAt" class="mb-1">Last updated: {{ updatedAt }}</p>
    <button
      type="button"
      class="inline-flex items-center flex-shrink-0 px-4 text-sm font-bold text-white rounded shadow focus:outline-none focus:ring bg-primary-500 hover:bg-primary-400 active:bg-primary-600 dark:text-gray-800 h-9"
      :class="{'opacity-50 cursor-not-allowed': btnDisabled || !contentsDiff}"
      :disabled="btnDisabled || !contentsDiff"
      @click.prevent="submit"
    >
      {{ btnText }}
    </button>
  </div>
</template>

<script>
export default {
	data () {
		return {
			contents: '',
			originalContents: '',
			btnText: 'Save',
			btnDisabled: false,
			updatedAt: null,
		};
	},

	metaInfo() {
		return {
			title: 'Robots.txt Editor',
		}
	},
	computed: {
		contentsDiff () {
			return this.contents !== this.originalContents;
		},
	},
	mounted() {
		this.btnText = 'Loading...';
		this.btnDisabled = true;
		window.Nova.request().get('/nova-vendor/nova-robots-editor/robots-file').then(res => {
			this.originalContents = res.data.contents;
			this.contents = res.data.contents;
			this.updatedAt = res.data.updated_at;
			this.btnText = 'Save';
			this.btnDisabled = false;
		})
	},

	methods: {
		submit () {
			const confirm = window.confirm('Are you sure you want to save and override the existing robots.txt?');
			if (!confirm) {
				return;
			}
			this.btnText = 'Saving...';
			this.btnDisabled = true;
			window.Nova.request().post('/nova-vendor/nova-robots-editor/robots-file', {contents: this.contents}).then(res => {
				this.originalContents = res.data.contents;
				this.contents = res.data.contents;
				this.updatedAt = res.data.updated_at;
				this.btnText = 'Saved';
				this.btnDisabled = false;
				window.setTimeout(() => {this.btnText = 'Save'}, 4000);
			})
		},
	},
}
</script>

<style>
/* Scoped Styles */
</style>
