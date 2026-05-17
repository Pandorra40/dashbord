<script setup lang="ts">
const props = defineProps<{ service?: any }>()
const emit = defineEmits(['close'])

const isEdit = !!props.service

const form = reactive({
  nom: props.service?.nom ?? '',
  url: props.service?.url ?? 'http://',
  icone: props.service?.icone ?? '',
  description: props.service?.description ?? '',
  categorie: props.service?.categorie ?? 'public',
  couleur: props.service?.couleur ?? '#6366f1'
})

const loading = ref(false)

async function submit() {
  if (!form.nom || !form.url) return
  loading.value = true
  try {
    if (isEdit) {
      await $fetch(`/api/services/${props.service.id}`, { method: 'PUT', body: form })
    } else {
      await $fetch('/api/services', { method: 'POST', body: form })
    }
    emit('close')
  } finally {
    loading.value = false
  }
}

const previewUrl = computed(() =>
  form.icone ? `https://cdn.simpleicons.org/${form.icone}/${form.couleur.replace('#', '')}` : ''
)
</script>

<template>
  <UModal :open="true" :title="isEdit ? 'Modifier le service' : 'Ajouter un service'" @update:open="emit('close')">
    <template #body>
      <div class="p-4 space-y-4">

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-gray-400 mb-1.5">Nom *</label>
            <input v-model="form.nom" type="text" placeholder="Jellyfin" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-indigo-500 transition-colors" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-400 mb-1.5">URL *</label>
            <input v-model="form.url" type="url" placeholder="http://localhost:8096" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-indigo-500 transition-colors" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-gray-400 mb-1.5">
              Icône
              <a href="https://simpleicons.org" target="_blank" class="text-indigo-400 ml-1 font-normal">simpleicons.org →</a>
            </label>
            <input v-model="form.icone" type="text" placeholder="jellyfin" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-indigo-500 transition-colors" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-400 mb-1.5">Couleur</label>
            <div class="flex gap-2 items-center">
              <input v-model="form.couleur" type="color" class="w-9 h-9 rounded-lg cursor-pointer bg-gray-800 border border-gray-700 p-0.5" />
              <input v-model="form.couleur" type="text" class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-indigo-500 transition-colors" />
            </div>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-400 mb-1.5">Description</label>
          <input v-model="form.description" type="text" placeholder="Serveur multimédia" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-indigo-500 transition-colors" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-400 mb-1.5">Catégorie</label>
          <div class="flex gap-2">
            <button :class="['flex-1 py-2 rounded-lg text-sm font-medium border transition-colors', form.categorie === 'public' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white']" @click="form.categorie = 'public'">
              <UIcon name="i-lucide-globe" class="w-4 h-4 inline mr-1" /> Public
            </button>
            <button :class="['flex-1 py-2 rounded-lg text-sm font-medium border transition-colors', form.categorie === 'admin' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white']" @click="form.categorie = 'admin'">
              <UIcon name="i-lucide-server" class="w-4 h-4 inline mr-1" /> Système
            </button>
          </div>
        </div>

        <!-- Aperçu -->
        <div v-if="form.nom || form.icone" class="flex items-center gap-3 p-3 bg-gray-800 rounded-xl border border-gray-700">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" :style="`background: ${form.couleur}20`">
            <img v-if="previewUrl" :src="previewUrl" :alt="form.nom" class="w-6 h-6" />
            <UIcon v-else name="i-lucide-box" class="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <p class="text-sm font-semibold text-white">{{ form.nom || '—' }}</p>
            <p class="text-xs text-gray-500">{{ form.description || form.url }}</p>
          </div>
        </div>

        <div class="flex gap-2 pt-1">
          <button class="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm font-medium transition-colors" @click="emit('close')">
            Annuler
          </button>
          <button :disabled="loading || !form.nom || !form.url" class="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors" @click="submit">
            {{ loading ? 'Enregistrement…' : isEdit ? 'Modifier' : 'Ajouter' }}
          </button>
        </div>

      </div>
    </template>
  </UModal>
</template>
