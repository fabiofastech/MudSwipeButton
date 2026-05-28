# SwipeConfirmButton

Componente Blazor riutilizzabile che riproduce il comportamento del **bottone swipe di iPhone** per rispondere/rifiutare chiamate. L'utente trascina un thumb circolare da sinistra verso destra per confermare un'azione.

---

## 📦 Struttura della soluzione

```
MudSwipeButton.slnx
│
├── MudSwipeButton.Components/        ← Razor Class Library (riutilizzabile)
│   ├── SwipeConfirmButton.razor
│   ├── SwipeConfirmButton.razor.css
│   └── wwwroot/js/swipebutton.js
│
├── MudSwipeButton/MudSwipeButton/    ← App demo — server host (ASP.NET Core)
└── MudSwipeButton/MudSwipeButton.Client/ ← App demo — client WASM (pagina demo)
```

---

## ✅ Prerequisiti

- .NET 10 SDK
- [MudBlazor 9.x](https://mudblazor.com) installato nel progetto consumatore

---

## 🚀 Come integrare in un'altra soluzione

### 1. Copia il progetto RCL

Copia la cartella `MudSwipeButton.Components/` nella root della tua soluzione.

### 2. Aggiungi il riferimento al progetto

```bash
# Per un'app Blazor Web App con WASM — aggiungi al progetto Client
dotnet add <TuoProgetto.Client.csproj> reference MudSwipeButton.Components/MudSwipeButton.Components.csproj

# Aggiungi anche al progetto Server (necessario per il pre-rendering)
dotnet add <TuoProgetto.csproj> reference MudSwipeButton.Components/MudSwipeButton.Components.csproj
```

> ⚠️ **Importante per Blazor Web App**: il componente usa `@rendermode InteractiveWebAssembly` (o Server), quindi deve essere referenziato **sia dal progetto server che dal progetto client** affinché sia disponibile nel bundle WASM e nel pre-rendering SSR.

### 3. Configura MudBlazor (se non già presente)

**Server `Program.cs`:**
```csharp
using MudBlazor.Services;

builder.Services.AddMudServices();
```

**Client `Program.cs`:**
```csharp
using MudBlazor.Services;

builder.Services.AddMudServices();
```

**`App.razor` — head:**
```html
<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" rel="stylesheet" />
<link href="_content/MudBlazor/MudBlazor.min.css" rel="stylesheet" />
```

**`App.razor` — body (prima di `</body>`):**
```html
<script src="_content/MudBlazor/MudBlazor.min.js"></script>
```

**`MainLayout.razor`:**
```razor
<MudThemeProvider />
<MudPopoverProvider />
<MudDialogProvider />
<MudSnackbarProvider />

@Body
```

### 4. Aggiungi il namespace agli `_Imports.razor`

```razor
@using MudSwipeButton.Components
```

---

## 🧩 Utilizzo del componente

Il componente **deve essere usato in un contesto interattivo** (WASM o Server), perché gestisce eventi pointer tramite JavaScript.

### Esempio base

```razor
@rendermode InteractiveWebAssembly

<SwipeConfirmButton OnConfirmed="OnAnswered" />

@code {
    private void OnAnswered() => Console.WriteLine("Risposta accettata!");
}
```

### Esempio completo con tutti i parametri

```razor
@rendermode InteractiveWebAssembly

<SwipeConfirmButton
    Label="Scorri per rispondere"
    ConfirmedLabel="In chiamata…"
    Icon="@Icons.Material.Filled.Phone"
    ConfirmedIcon="@Icons.Material.Filled.Check"
    TrackColor="#2E7D32"
    ConfirmedTrackColor="#1565C0"
    ThresholdPercent="75"
    OnConfirmed="OnAnswered"
    ResetAfterConfirm="true"
    Width="300px"
    Disabled="false" />
```

### Uso con riferimento per reset programmatico

```razor
<SwipeConfirmButton @ref="_swipeBtn"
    Label="Scorri per confermare"
    OnConfirmed="OnConfirmed" />

<MudButton OnClick="Reset">Reset</MudButton>

@code {
    private SwipeConfirmButton _swipeBtn = default!;

    private void OnConfirmed() { /* ... */ }

    private async Task Reset() => await _swipeBtn.ResetAsync();
}
```

---

## 📋 Parametri

| Parametro | Tipo | Default | Descrizione |
|-----------|------|---------|-------------|
| `Label` | `string` | `"Scorri per rispondere"` | Testo visualizzato sul track prima dello swipe |
| `ConfirmedLabel` | `string` | `"In chiamata…"` | Testo visualizzato dopo la conferma |
| `Icon` | `string` | `Icons.Material.Filled.Phone` | Icona MudBlazor nel thumb (qualsiasi `Icons.*`) |
| `ConfirmedIcon` | `string` | `Icons.Material.Filled.Check` | Icona nel thumb dopo la conferma |
| `TrackColor` | `string` | `"#2E7D32"` | Colore CSS del track (hex, rgb, nome CSS, ecc.) |
| `ConfirmedTrackColor` | `string?` | `null` (= uguale a `TrackColor`) | Colore CSS del track dopo la conferma |
| `ThresholdPercent` | `int` | `75` | Percentuale (0–100) che il thumb deve raggiungere per confermare |
| `OnConfirmed` | `EventCallback` | — | Callback invocato quando lo swipe è completato con successo |
| `Width` | `string` | `"300px"` | Larghezza del componente (qualsiasi valore CSS: `"100%"`, `"20rem"`, ecc.) |
| `Disabled` | `bool` | `false` | Se `true`, disabilita tutta l'interazione |
| `ResetAfterConfirm` | `bool` | `false` | Se `true`, torna automaticamente allo stato idle 1,2 secondi dopo `OnConfirmed` |

## 🔧 Metodi pubblici

| Metodo | Descrizione |
|--------|-------------|
| `ResetAsync()` | Riporta il componente allo stato idle (thumb a sinistra, label visibile) |

---

## 🎨 Esempi di varianti colore

```razor
@* Verde — risposta chiamata *@
<SwipeConfirmButton TrackColor="#2E7D32" Icon="@Icons.Material.Filled.Phone"
    Label="Scorri per rispondere" OnConfirmed="OnAnswer" />

@* Rosso — rifiuta chiamata *@
<SwipeConfirmButton TrackColor="#C62828" Icon="@Icons.Material.Filled.PhoneDisabled"
    Label="Scorri per rifiutare" OnConfirmed="OnReject" />

@* Blu — conferma generica *@
<SwipeConfirmButton TrackColor="#1565C0" Icon="@Icons.Material.Filled.CheckCircle"
    Label="Scorri per confermare" OnConfirmed="OnConfirm" />

@* Arancione — attenzione *@
<SwipeConfirmButton TrackColor="#E65100" Icon="@Icons.Material.Filled.Warning"
    Label="Scorri per procedere" OnConfirmed="OnProceed" />
```

---

## ⚙️ Come funziona internamente

| Layer | Responsabilità |
|-------|----------------|
| **CSS** (`.razor.css`) | Layout pill, thumb circolare, transizioni, stati `confirmed` e `disabled` |
| **JavaScript** (`swipebutton.js`) | Tracking pointer nativo via `PointerEvents` + `setPointerCapture` — nessun lag |
| **C#** (`.razor`) | Stato del componente, callback .NET, lifecycle e dispose |

Il tracking del drag avviene **interamente in JavaScript** (aggiornamento diretto della proprietà CSS `transform`). Il bridge .NET viene chiamato **solo** al completamento o all'annullamento dello swipe, garantendo fluidità anche su dispositivi mobili.

---

## 🏗️ Build e run dell'app demo

```powershell
# Dalla root della soluzione
dotnet build MudSwipeButton.slnx
dotnet run --project MudSwipeButton\MudSwipeButton\MudSwipeButton.csproj
```

Apri `https://localhost:<porta>` per vedere la pagina demo con 3 varianti del componente.
