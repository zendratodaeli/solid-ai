"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import languages from "@/lib/language";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { ArrowBigRight, Text } from "lucide-react";
import { Loader } from "@/components/loader";
import Heading from "@/components/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/empty";

const AudioTranslate = () => {
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(languages[0].value);
  const [generatedTranslation, setGeneratedTranslation] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | undefined>();

  
  const transcribe = async (): Promise<{ text: string } | null> => {
    const url = "https://api.openai.com/v1/audio/transcriptions";
    if (!selectedFile) {
      toast.error('No file selected.');
      return null;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append("model", "whisper-1");
    formData.append("response_format", "verbose_json");
    formData.append("language", language);
    const openAIKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
   

    try {
      const response = await axios.post(url, formData, {
        headers: { "Authorization": `Bearer ${openAIKey}` }
      });
      if (response.data && 'text' in response.data) {
        return response.data;
      }
      toast.error('Invalid response format.');
      return null;
    } catch (error) {
      toast.error('Error during transcription');
      return null;
    }
  };
  
  const translateAudio = async () => {
    setLoading(true);
    setGeneratedTranslation('');

    const transcribed = await transcribe();
    if (transcribed) {
      setGeneratedTranslation(transcribed.text);
    } else {

      toast.error('Failed to transcribe audio.');
    }
    setLoading(false);
  };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files && event.target.files[0];
      if(file) {
        setSelectedFile(file)
      }
    };


  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const selectedLabel = languages.find(language => language.value === selectedValue)?.value;
    if(selectedLabel) {
      setLanguage(selectedLabel);
    };
  }

  return (
    <div className=" ml-30">
      <Heading 
        title="Transcribe"
        description="Our most advanced transcribe model"
        icon={Text}
        iconColor="text-violet-500"
        bgColor="bg-emerald-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <p className=" text-left font-medium">
            Upload Audio & Video
          </p>
        </div>
        <Input
          className="block mb-2 w-full text-sm text-gray-900 border border-gray-500 rounded-lg"
          type="file" 
          accept="audio/*"
          onChange={handleFileChange}
        />
        <p className=" my-2 text-sm text-gray-500 dark:text-gray-300">
          The audio file object (not file name) to transcribe, 
          in one of these formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm.
        </p>

        <div className=" my2 text-sm text-gray-500 dark:text-gray-300">
          <p className=" text-left font-medium">Choose your language</p>
        </div>

        <select 
          className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg"
          onChange={handleChange}
          value={language}  
        >
          {languages.map(language => (
            <option key={language.value} value={language.value}>
              {language.label}
            </option>
          ))}
        </select>

        {!loading && (
          <Button 
            className="col-span-12 lg:col-span-2 w-full mt-2"
            onClick={translateAudio}
            disabled={loading}
          >
            Transcribe
          </Button>
        )}

        {loading && (
          <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted mt-4">
            <Loader />
          </div>
        )}

        {!language && !loading && (
            <Empty label="No audio transcribe!"/>
        )}

        {generatedTranslation && (
          <>
            <label className=" block my-2 text-md text-left font-medium text-gray-900 dark:text-white">
              Result
            </label>
            <div 
              className=" p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg broder border-gray-500"
              onClick={() => {
                navigator.clipboard.writeText(generatedTranslation);
                toast("Translation copied to clipboard", {icon: "📝"})
              }}
            >
              <p>{generatedTranslation}</p>
            </div>
            <p className=" my-1 text-sm text-gray-500 dark:text-gray-300">
              Click to copy
            </p>
            <div className=" mb-[-80px]"/>
          </>
        )}
      </div>
    </div>
  );
};

export default AudioTranslate;
