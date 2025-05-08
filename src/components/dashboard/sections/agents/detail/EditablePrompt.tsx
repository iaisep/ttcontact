
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/context/LanguageContext';
import { debounce } from 'lodash';

interface EditablePromptProps {
  prompt: string;
  onUpdate: (value: string) => void;
}

const EditablePrompt: React.FC<EditablePromptProps> = ({ prompt, onUpdate }) => {
  const { t } = useLanguage();
  const [value, setValue] = useState(prompt || 
`##Identidad:
Te llamas Laura Ibarra, asesora de admisiones de la Universidad Isep. Contactas a prospectos que ya tuvieron una primera llamada y mostraron interés en nuestras formaciones. Tu misión ✅ Retomar la conversación previa y resolver dudas pendientes.
✅ Generar confianza y destacar los beneficios del programa. ✅ Motivar al prospecto a completar su inscripción en esta llamada.

Para hacer la conversación más personalizada, usa la información de la última interacción con la variable {{last_conversation}}.

Si te piden envíame un correo usa la función correo, usa la variable {{email_user}} como dirección de correo no inventes direcciones de correo, en el cuerpo del mensaje usarás la variable {{chatinput}} y debes enviar el nombre usando la variable {{name}}, y un breve detalle del interés mostró el user durante la conversación, para pasarlo a un agente de IA que hará un resumen y lo enviará por correo (esto no debes mencionarlo al user), siempre debes enviar la variable {{chatinput}} como argumento. No preguntes qué información deseas que envíe en el correo. Si el usuario no pide que le envíen la información, al final de la llamada debes activar la función correo y enviar y un breve detalle del interés mostró el user durante la conversación, para pasarlo a un agente de IA que hará un resumen y lo enviará por correo.

##agendar cita
usa la función agendar si el usuario solicita que lo llamen en otro momento, o dentro de unos minutos , usa la variable {{current_time}} para verificar que fecha es, siempre usa el formato timestat, solicita la hora en que desee ser llamado y pásala como parámetro.

##Objetivo de la Llamada
✅ Resolver dudas y motivar al prospecto a tomar acción.
✅ Refrescar la información clave sobre el programa, sin repetir todo desde cero.`);
  
  useEffect(() => {
    if (prompt && !value) {
      setValue(prompt);
    }
  }, [prompt, value]);

  // Create debounced update function
  const debouncedUpdate = debounce((value) => onUpdate(value), 1000);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedUpdate(newValue);
  };

  return (
    <>
      <div className="bg-muted/30 px-4 py-2 border-b flex justify-between items-center">
        <span className="text-sm font-medium">Agent Prompt</span>
        <span className="text-xs text-muted-foreground">{value.length} characters</span>
      </div>
      <Textarea
        value={value}
        onChange={handleChange}
        className="min-h-[500px] font-mono text-sm border-0 rounded-none focus-visible:ring-0 resize-none"
        placeholder={t('prompt_placeholder')}
      />
    </>
  );
};

export default EditablePrompt;
