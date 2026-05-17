<script setup lang="ts">
const { data: services, refresh } = await useFetch<any[]>('/api/services')

const onglet = ref<'public' | 'admin'>('public')
const showLogin = ref(false)
const showAdd = ref(false)
const showEdit = ref<any>(null)
const isAdmin = ref(false)
const password = ref('')
const loginError = ref('')

const servicesFiltres = computed(() =>
  (services.value ?? []).filter(s => s.categorie === onglet.value)
)

onMounted(() => {
  isAdmin.value = sessionStorage.getItem('admin') === '1'
})

async function login() {
  loginError.value = ''
  try {
    await $fetch('/api/auth', { method: 'POST', body: { password: password.value } })
    sessionStorage.setItem('admin', '1')
    isAdmin.value = true
    showLogin.value = false
    password.value = ''
  } catch {
    loginError.value = 'Mot de passe incorrect'
  }
}

function logout() {
  sessionStorage.removeItem('admin')
  isAdmin.value = false
}

async function deleteService(id: number) {
  if (!confirm('Supprimer ce service ?')) return
  await $fetch(`/api/services/${id}`, { method: 'DELETE' })
  refresh()
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-gray-100">

    <!-- HEADER -->
    <header class="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <UIcon name="i-lucide-layout-dashboard" class="w-5 h-5 text-white" />
          </div>
          <span class="font-bold text-lg tracking-tight text-white">Tableau de bord</span>
        </div>

        <div class="flex items-center gap-2">
          <div class="flex bg-gray-800 rounded-lg p-1 gap-1">
            <button
              :class="['px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5', onglet === 'public' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white']"
              @click="onglet = 'public'"
            >
              <UIcon name="i-lucide-globe" class="w-4 h-4" /> Public
            </button>
            <button
              :class="['px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5', onglet === 'admin' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white']"
              @click="onglet = 'admin'"
            >
              <UIcon name="i-lucide-server" class="w-4 h-4" /> Système
            </button>
          </div>

          <button v-if="!isAdmin" class="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors" title="Mode édition" @click="showLogin = true">
            <UIcon name="i-lucide-lock" class="w-5 h-5" />
          </button>
          <template v-else>
            <button class="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors flex items-center gap-1.5" @click="showAdd = true">
              <UIcon name="i-lucide-plus" class="w-4 h-4" /> Ajouter
            </button>
            <button class="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-red-400 transition-colors" title="Déconnexion" @click="logout">
              <UIcon name="i-lucide-log-out" class="w-5 h-5" />
            </button>
          </template>
        </div>
      </div>
    </header>

    <!-- GRILLE -->
    <main class="max-w-7xl mx-auto px-6 py-12">
      <div v-if="!servicesFiltres.length" class="text-center py-24 text-gray-600">
        <UIcon name="i-lucide-inbox" class="w-14 h-14 mx-auto mb-4 opacity-50" />
        <p class="text-lg">Aucun service dans cette catégorie</p>
        <p v-if="isAdmin" class="text-sm mt-2 text-indigo-400 cursor-pointer" @click="showAdd = true">+ Ajouter un service</p>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div v-for="service in servicesFiltres" :key="service.id" class="group relative">
          <a
            :href="service.url"
            target="_blank"
            rel="noopener"
            class="flex flex-col items-center gap-3 p-5 rounded-2xl bg-gray-900 border border-gray-800 hover:border-gray-600 hover:bg-gray-800/80 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 cursor-pointer"
          >
            <div class="w-14 h-14 rounded-xl flex items-center justify-center" :style="`background: ${service.couleur}18; border: 1px solid ${service.couleur}35`">
              <img
                :src="`https://cdn.simpleicons.org/${service.icone}/${service.couleur.replace('#','')}`"
                :alt="service.nom"
                class="w-8 h-8"
                @error="(e: any) => e.target.style.display='none'"
              />
            </div>
            <div class="text-center">
              <p class="font-semibold text-sm text-white leading-tight">{{ service.nom }}</p>
              <p class="text-xs text-gray-500 mt-0.5 leading-tight">{{ service.description }}</p>
            </div>
          </a>

          <!-- Boutons admin au hover -->
          <div v-if="isAdmin" class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="w-7 h-7 rounded-lg bg-gray-800/90 hover:bg-indigo-600 flex items-center justify-center transition-colors backdrop-blur" @click.prevent="showEdit = { ...service }">
              <UIcon name="i-lucide-pencil" class="w-3.5 h-3.5 text-white" />
            </button>
            <button class="w-7 h-7 rounded-lg bg-gray-800/90 hover:bg-red-600 flex items-center justify-center transition-colors backdrop-blur" @click.prevent="deleteService(service.id)">
              <UIcon name="i-lucide-trash-2" class="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- MODAL LOGIN -->
    <UModal v-model:open="showLogin" title="Mode édition">
      <template #body>
        <div class="p-4 space-y-4">
          <p class="text-sm text-gray-400">Entrez le mot de passe pour modifier le tableau de bord.</p>
          <input
            v-model="password"
            type="password"
            placeholder="Mot de passe"
            class="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none focus:border-indigo-500 transition-colors"
            @keyup.enter="login"
          />
          <p v-if="loginError" class="text-sm text-red-400">{{ loginError }}</p>
          <button class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-colors" @click="login">
            Connexion
          </button>
        </div>
      </template>
    </UModal>

    <!-- MODALS FORMULAIRE -->
    <ServiceForm v-if="showAdd" @close="showAdd = false; refresh()" />
    <ServiceForm v-if="showEdit" :service="showEdit" @close="showEdit = null; refresh()" />

  </div>
</template>
