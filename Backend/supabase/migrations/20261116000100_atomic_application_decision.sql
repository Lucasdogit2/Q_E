-- Aprova/rejeita inscrições com bloqueio da vaga para evitar exceder
-- o número de vagas quando duas decisões acontecem simultaneamente.
-- Aplicar este arquivo no SQL Editor do Supabase antes de usar a nova rota.

CREATE OR REPLACE FUNCTION public.decide_application(
  p_application_id uuid,
  p_staff_id uuid,
  p_status text
)
RETURNS public.applications
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_internship_id uuid;
  v_internship_staff_id uuid;
  v_vacancies integer;
  v_application_status text;
  v_approved_count integer;
  v_application public.applications;
BEGIN
  IF p_status IS NULL OR p_status NOT IN ('approved', 'rejected') THEN
    RAISE EXCEPTION 'Decisão inválida.' USING ERRCODE = 'P0001';
  END IF;

  IF p_application_id IS NULL OR p_staff_id IS NULL THEN
    RAISE EXCEPTION 'Identificação da solicitação ou do servidor inválida.' USING ERRCODE = 'P0001';
  END IF;

  SELECT internship_id
    INTO v_internship_id
    FROM public.applications
   WHERE id = p_application_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Solicitação não encontrada.' USING ERRCODE = 'P0001';
  END IF;

  -- O bloqueio da linha da vaga serializa decisões concorrentes para ela.
  SELECT staff_id, vacancies
    INTO v_internship_staff_id, v_vacancies
    FROM public.internships
   WHERE id = v_internship_id
   FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Vaga não encontrada.' USING ERRCODE = 'P0001';
  END IF;

  IF v_internship_staff_id IS DISTINCT FROM p_staff_id THEN
    RAISE EXCEPTION 'Você não é responsável por esta vaga.' USING ERRCODE = 'P0001';
  END IF;

  SELECT status
    INTO v_application_status
    FROM public.applications
   WHERE id = p_application_id
   FOR UPDATE;

  IF v_application_status IS DISTINCT FROM 'pending' THEN
    RAISE EXCEPTION 'Esta solicitação já foi analisada.' USING ERRCODE = 'P0001';
  END IF;

  IF p_status = 'approved' THEN
    SELECT count(*)::integer
      INTO v_approved_count
      FROM public.applications
     WHERE internship_id = v_internship_id
       AND status = 'approved';

    IF v_approved_count >= v_vacancies THEN
      RAISE EXCEPTION 'Todas as vagas desta oportunidade já foram preenchidas.' USING ERRCODE = 'P0001';
    END IF;
  END IF;

  UPDATE public.applications
     SET status = p_status,
         decided_at = now()
   WHERE id = p_application_id
   RETURNING * INTO v_application;

  RETURN v_application;
END;
$$;

REVOKE ALL ON FUNCTION public.decide_application(uuid, uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.decide_application(uuid, uuid, text) FROM anon;
REVOKE ALL ON FUNCTION public.decide_application(uuid, uuid, text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.decide_application(uuid, uuid, text) TO service_role;
